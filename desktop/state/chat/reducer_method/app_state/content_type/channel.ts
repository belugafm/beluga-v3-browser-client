import * as api from "../../../../../api"

import { AppStateT, ContentStateT, ContentType } from "../../../store/app_state"
import { ChannelObjectT, MessageObjectT } from "../../../../../api/object"
import { fetch, merge } from "../../../store/domain_data"

import { AbstractContentAction } from "./class"
import { DomainDataT } from "../../../store/domain_data/types"
import { StoreT } from "../../../store/reducer"
import config from "../../../../../config"
import { insertContent } from "../content"

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
export const buildContentStateFromData = (data: {
    channel: ChannelObjectT
    messages: MessageObjectT[]
}): ContentStateT => {
    const { channel, messages } = data
    const contentId = Date.now()
    return {
        id: contentId,
        type: ContentType.Channel,
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
            query: {
                channelId: channel.id,
                limit: config.timeline.maxNumStatuses,
            },
        },
    }
}
export const add = (store: StoreT, content: ContentStateT): StoreT => {
    const nextAppState: AppStateT = {
        content_grid: insertContent(content, store.appState.content_grid, null),
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
    const [nextDomainData, response] = await _fetch(store.domainData, timelineQuery)
    const { channel, messages } = response
    const columnId = Date.now()

    const column: ContentStateT = {
        id: columnId,
        type: ContentType.Channel,
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
            messageIds: messages.map((status) => status.id),
            query: timelineQuery,
        },
    }

    const nextAppState: AppStateT = {
        content_grid: insert(column, store.appState.content_grid, params.insertColumnAfter),
    }

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
    const nextAppState: AppStateT = {
        content_grid: copyContents(store.appState.content_grid),
    }

    const [nextDomainData, response] = await fetch(
        store.domainData,
        api.timeline.channel,
        Object.assign({ channelId: params.query.channelId }, params.query)
    )

    const column = findByIndex(nextAppState.content_grid, params.column.id)
    column.timeline.query = params.query
    column.timeline.messageIds = response.messages.map((status) => status.id)

    return [
        {
            domainData: nextDomainData,
            appState: nextAppState,
        },
        response,
    ]
}
export const updateTimeline = async (
    store: StoreT,
    desiredColumn: ContentStateT
): Promise<[StoreT, api.Response | null]> => {
    const [nextDomainData, response] = await fetch(
        store.domainData,
        api.timeline.channel,
        Object.assign(
            {
                channelId: desiredColumn.timeline.query.channelId,
            },
            desiredColumn.timeline.query
        )
    )
    const { messages } = response

    const nextAppState: AppStateT = {
        content_grid: copyContents(store.appState.content_grid),
    }
    const nextTargetColumn = findByIndex(nextAppState.content_grid, desiredColumn.id)
    if (nextTargetColumn) {
        nextTargetColumn.timeline.messageIds = messages.map((status) => status.id)
    }

    return [
        {
            domainData: nextDomainData,
            appState: nextAppState,
        },
        response,
    ]
}
