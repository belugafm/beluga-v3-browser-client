import * as api from "../../../../../api"

import { AppStateT, ContentStateT } from "../../types/app_state"
import { ChannelObjectT, MessageObjectT } from "../../../../../api/object"
import { copyContents, insertContent } from "./content"

import { ContentType } from "../../app_state"
import { DomainDataT } from "../../types/domain_data"
import { StoreT } from "../../types/store"
import config from "../../../../../config"
import { fetch } from "../../domain_data"

const _fetch = (
    prevDomainData: DomainDataT,
    query: Parameters<typeof api.timeline.channel>[0]
): Promise<
    [
        DomainDataT,
        {
            channel: ChannelObjectT
            messages: MessageObjectT[]
        }
    ]
> => {
    return new Promise((resolve, reject) => {
        fetch(prevDomainData, api.channel.show, {
            id: query.channelId,
        })
            .then(([nextDomainData, response]) => {
                const prevDomainData = nextDomainData
                const { channel } = response
                fetch(
                    prevDomainData,
                    api.timeline.channel,
                    Object.assign(
                        {
                            channelId: query.channelId,
                        },
                        query
                    )
                )
                    .then(([nextDomainData, response]) => {
                        const { messages } = response
                        resolve([
                            nextDomainData,
                            {
                                channel,
                                messages,
                            },
                        ])
                    })
                    .catch((error) => reject(error))
            })
            .catch((error) => reject(error))
    })
}
const checkIfUpToDate = (channel: ChannelObjectT, messages: MessageObjectT[]) => {
    if (messages.length == 0) {
        return false
    }
    if (channel.last_message_id == null) {
        return true
    }
    const latestMessage = messages[0]
    if (channel.last_message_id == latestMessage.id) {
        return true
    }
    return false
}
export const buildContentStateFromData = (data: {
    channel: ChannelObjectT
    messages: MessageObjectT[]
}): ContentStateT => {
    const { channel, messages } = data
    const contentId = Date.now()
    return {
        id: contentId,
        type: ContentType.Channel,
        column: -1,
        row: -1,
        postbox: {
            enabled: true,
            query: {
                channelId: channel.id,
            },
        },
        context: {
            channelId: channel.id,
            channelGroupId: channel.parent_channel_group_id,
        },
        options: {
            showMutedMessage: false,
        },
        timeline: {
            messageIds: messages.map((message) => message.id),
            shouldFetch: true,
            upToDate: checkIfUpToDate(channel, messages),
            query: {
                channelId: channel.id,
                limit: config.timeline.maxNumStatuses,
            },
        },
    }
}
export const add = (store: StoreT, content: ContentStateT): StoreT => {
    const nextAppState: AppStateT = {
        contents: insertContent(content, store.appState.contents, null),
    }
    return {
        domainData: store.domainData,
        appState: nextAppState,
    }
}
export const asyncAdd = async (
    store: StoreT,
    params: {
        channelId: number
        insertColumnAfter?: number
    }
): Promise<[StoreT, api.Response | null]> => {
    const timelineQuery = {
        channelId: params.channelId,
        limit: config.timeline.maxNumStatuses,
    }
    const [nextDomainData] = await _fetch(store.domainData, timelineQuery)
    const nextAppState = store.appState
    return [
        {
            domainData: nextDomainData,
            appState: nextAppState,
        },
        null,
    ]
}
export const setTimelineQuery = async (
    store: StoreT,
    params: {
        column: ContentStateT
        query: ContentStateT["timeline"]["query"]
    }
): Promise<[StoreT, api.Response | null]> => {
    const [nextDomainData, response] = await fetch(
        store.domainData,
        api.timeline.channel,
        Object.assign({ channelId: params.query.channelId }, params.query)
    )

    const nextAppState = store.appState

    return [
        {
            domainData: nextDomainData,
            appState: nextAppState,
        },
        response,
    ]
}

export const loadLatestMessages = async (
    prevStore: StoreT,
    prevContent: ContentStateT
): Promise<[StoreT, api.Response | null]> => {
    const [nextDomainData, response] = await fetch(
        prevStore.domainData,
        api.timeline.channel,
        Object.assign(
            {
                channelId: prevContent.timeline.query.channelId,
            },
            {
                sinceId:
                    prevContent.timeline.messageIds.length == 0
                        ? null
                        : prevContent.timeline.messageIds[0],
            }
        )
    )
    const { messages } = response

    const nextAppState: AppStateT = {
        contents: copyContents(prevStore.appState.contents),
    }
    const nextContent = nextAppState["contents"][prevContent.column][prevContent.row]
    nextContent.timeline.messageIds = messages
        .map((message) => message.id)
        .concat(nextContent.timeline.messageIds)

    if (nextContent.timeline.messageIds.length > 0) {
        const latestMessageId = nextContent.timeline.messageIds[0]
        if (nextContent.type == ContentType.Channel) {
            const channel = nextDomainData.channels.get(nextContent.context.channelId)
            if (channel.last_message_id === latestMessageId) {
                nextContent.timeline.upToDate = true
            }
        } else if (nextContent.type == ContentType.ChannelGroup) {
            const channelGroup = nextDomainData.channelGroups.get(
                nextContent.context.channelGroupId
            )
            if (channelGroup.last_message_id === latestMessageId) {
                nextContent.timeline.upToDate = true
            }
        }
    }

    return [
        {
            domainData: nextDomainData,
            appState: nextAppState,
        },
        response,
    ]
}