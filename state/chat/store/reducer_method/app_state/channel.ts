import * as api from "../../../../../api"
import { Response } from "../../../../../api"

import { AppStateT, ContentStateT, ContentType, TimelineMode } from "../../types/app_state"
import { ChannelId, ChannelObjectT, MessageId, MessageObjectT } from "../../../../../api/object"
import { insertContent } from "./content"

import { DomainDataT } from "../../types/domain_data"
import { StoreT } from "../../types/store"
import config from "../../../../../config"
import { fetch } from "../fetch"
import { copyAppState, copyContents } from "../../app_state/copy"
import { findContentInAppState } from "../../app_state/content"

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
        channelId: ChannelId
        insertColumnAfter?: number
    }
): Promise<[StoreT, Response | null]> => {
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
): Promise<[StoreT, Response]> => {
    const { channelId } = params.query
    if (channelId == null) {
        throw new Error()
    }
    const [nextDomainData, response] = await fetch(
        store.domainData,
        api.timeline.channel,
        Object.assign({ channelId }, params.query)
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

const _after = (nextContent: ContentStateT, nextDomainData: DomainDataT) => {
    if (nextContent.timeline.messageIds.length > 0) {
        const latestMessageId = nextContent.timeline.messageIds[0]
        if (nextContent.type == ContentType.Channel) {
            const channel = nextDomainData.channels.get(nextContent.context.channelId)
            if (channel.last_message_id === latestMessageId) {
                nextContent.timeline.upToDate = true
            }
            nextContent.timeline.lastMessageId = channel.last_message_id
        } else if (nextContent.type == ContentType.ChannelGroup) {
            const channelGroup = nextDomainData.channelGroups.get(
                nextContent.context.channelGroupId
            )
            if (channelGroup.last_message_id === latestMessageId) {
                nextContent.timeline.upToDate = true
            }
            nextContent.timeline.lastMessageId = channelGroup.last_message_id
        } else if (nextContent.type == ContentType.Thread) {
            const thread = nextDomainData.messages.get(nextContent.context.messageId)
            if (thread.last_reply_message_id === latestMessageId) {
                nextContent.timeline.upToDate = true
            }
            nextContent.timeline.lastMessageId = thread.last_reply_message_id
        }
    }
}

export const prependMessagesWithMaxId = async (
    prevStore: StoreT,
    params: {
        prevContent: ContentStateT
        maxId: MessageId
    }
): Promise<[StoreT, Response | null]> => {
    const { prevContent, maxId } = params
    const [nextDomainData, response] = await fetch(prevStore.domainData, api.timeline.channel, {
        channelId: prevContent.timeline.query.channelId,
        maxId: maxId,
    })
    const { messages } = response

    const nextAppState = copyAppState(prevStore.appState)
    const nextContent = findContentInAppState(nextAppState, prevContent)
    nextContent.timeline.messageIds = nextContent.timeline.messageIds.concat(
        messages.map((message) => message.id)
    )
    _after(nextContent, nextDomainData)

    return [
        {
            domainData: nextDomainData,
            appState: nextAppState,
        },
        response,
    ]
}

export const appendMessagesWithSinceId = async (
    prevStore: StoreT,
    params: {
        prevContent: ContentStateT
        sinceId: MessageId
    }
): Promise<[StoreT, Response | null]> => {
    const { prevContent, sinceId } = params
    const [nextDomainData, response] = await fetch(prevStore.domainData, api.timeline.channel, {
        channelId: prevContent.timeline.query.channelId,
        sinceId: sinceId,
    })
    const { messages } = response

    const nextAppState = copyAppState(prevStore.appState)
    const nextContent = findContentInAppState(nextAppState, prevContent)
    nextContent.timeline.messageIds = messages
        .map((message) => message.id)
        .concat(nextContent.timeline.messageIds)
    _after(nextContent, nextDomainData)

    return [
        {
            domainData: nextDomainData,
            appState: nextAppState,
        },
        response,
    ]
}

export const showContextMessages = async (
    prevStore: StoreT,
    params: {
        prevContent: ContentStateT
        messageId: MessageId
    }
): Promise<[StoreT, Response | null]> => {
    const { prevContent, messageId } = params
    const nextAppState: AppStateT = {
        contents: copyContents(prevStore.appState.contents),
    }
    let nextDomainData = prevStore.domainData
    let messages = []
    {
        const [_nextDomainData, response] = await fetch(nextDomainData, api.timeline.channel, {
            channelId: prevContent.timeline.query.channelId,
            sinceId: messageId,
        })
        if (response.messages) {
            messages = messages.concat(response.messages)
        }
        nextDomainData = _nextDomainData
    }
    {
        const [_nextDomainData, response] = await fetch(nextDomainData, api.messages.show, {
            id: messageId,
        })
        if (response.message) {
            messages = messages.concat([response.message])
        }
        nextDomainData = _nextDomainData
    }
    {
        const [_nextDomainData, response] = await fetch(nextDomainData, api.timeline.channel, {
            channelId: prevContent.timeline.query.channelId,
            maxId: messageId,
        })
        if (response.messages) {
            messages = messages.concat(response.messages)
        }
        nextDomainData = _nextDomainData
    }

    const nextContent = findContentInAppState(nextAppState, prevContent)
    nextContent.timeline.messageIds = messages.map((message) => message.id)
    nextContent.timeline.mode = TimelineMode.ShowContextMessages

    return [
        {
            domainData: nextDomainData,
            appState: nextAppState,
        },
        null,
    ]
}

export const showLatestMessages = async (
    prevStore: StoreT,
    prevContent: ContentStateT
): Promise<[StoreT, Response | null]> => {
    const [nextDomainData, response] = await fetch(prevStore.domainData, api.timeline.channel, {
        channelId: prevContent.timeline.query.channelId,
    })
    const { messages } = response

    const nextAppState = copyAppState(prevStore.appState)
    const nextContent = findContentInAppState(nextAppState, prevContent)
    nextContent.timeline.messageIds = messages.map((message) => message.id)
    _after(nextContent, nextDomainData)
    nextContent.timeline.mode = TimelineMode.KeepUpToDate

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
): Promise<[StoreT, Response | null]> => {
    const sinceId =
        prevContent.timeline.messageIds.length == 0 ? null : prevContent.timeline.messageIds[0]
    return await appendMessagesWithSinceId(prevStore, {
        prevContent,
        sinceId,
    })
}
