import { ColumnTypes, ColumnStateT, AppStateDataT } from "../../app"
import { DomainDataT, fetch } from "../../data"
import { StoreDataT } from "../../reducer"
import * as WebAPI from "../../../../api"
import { ChannelObject, StatusObject } from "../../../../api/object"
import equals from "deep-equal"

const _fetch = (
    prevDomainData: DomainDataT,
    query: {
        channel_id: string
    }
): Promise<
    [
        DomainDataT,
        {
            channel: ChannelObject
            statuses: StatusObject[]
        }
    ]
> => {
    return new Promise((resolve, reject) => {
        fetch(prevDomainData, WebAPI.channels.show, {
            channel_id: query.channel_id,
        })
            .then(([nextDomainData, response]) => {
                const prevDomainData = nextDomainData
                const { channel } = response
                fetch(prevDomainData, WebAPI.timeline.channel, {
                    channel_id: query.channel_id,
                })
                    .then(([nextDomainData, response]) => {
                        const { statuses } = response
                        resolve([
                            nextDomainData,
                            {
                                channel,
                                statuses,
                            },
                        ])
                    })
                    .catch((error) => reject(error))
            })
            .catch((error) => reject(error))
    })
}

export const create = async (
    store: StoreDataT,
    query: {
        channelId: string
        columnIndex: number
    }
): Promise<[StoreDataT, WebAPI.Response | null]> => {
    const [nextDomainData, response] = await _fetch(store.domainData, {
        channel_id: query.channelId,
    })
    const { channel, statuses } = response

    const column: ColumnStateT = {
        index: query.columnIndex,
        type: ColumnTypes.Channel,
        postbox: {
            enabled: true,
            query: {
                channel_id: channel.id,
            },
        },
        context: {
            channelId: channel.id,
            communityId: channel.community_id,
        },
        timeline: {
            statusIds: statuses.map((status) => status.id),
            query: {
                channelId: channel.id,
            },
        },
    }

    const nextAppState: AppStateDataT = {
        columns: store.appState.columns.concat(column),
    }
    return [
        {
            domainData: nextDomainData,
            appState: nextAppState,
        },
        null,
    ]
}

export const updateTimeline = async (
    store: StoreDataT,
    query: {
        channelId?: string
        maxId?: string
        sinceId?: string
        maxDate?: string
        untilDate?: string
    }
): Promise<[StoreDataT, WebAPI.Response | null]> => {
    const [nextDomainData, response] = await fetch(
        store.domainData,
        WebAPI.timeline.channel,
        {
            channel_id: query.channelId,
        }
    )
    const { statuses } = response
    store.appState.columns.forEach((column) => {
        if (column.type !== ColumnTypes.Channel) {
            return
        }
        if (equals(query, column.timeline.query) !== true) {
            return
        }
        column.timeline.statusIds = statuses.map((status) => status.id)
    })

    const nextAppState: AppStateDataT = {
        columns: store.appState.columns.map((column) => column),
    }
    return [
        {
            domainData: nextDomainData,
            appState: nextAppState,
        },
        response,
    ]
}
