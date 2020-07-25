import { ColumnTypes, ColumnStateT, AppStateT } from "../../state/app"
import { DomainDataT, fetch } from "../../state/data"
import { StoreT } from "../../reducer"
import * as WebAPI from "../../../../api"
import { ChannelObjectT, StatusObjectT } from "../../../../api/object"
import equals from "deep-equal"

const _fetch = (
    prevDomainData: DomainDataT,
    query: Parameters<typeof WebAPI.channels.show>[0]
): Promise<
    [
        DomainDataT,
        {
            channel: ChannelObjectT
            statuses: StatusObjectT[]
        }
    ]
> => {
    return new Promise((resolve, reject) => {
        fetch(prevDomainData, WebAPI.channels.show, {
            channelId: query.channelId,
        })
            .then(([nextDomainData, response]) => {
                const prevDomainData = nextDomainData
                const { channel } = response
                fetch(prevDomainData, WebAPI.timeline.channel, {
                    channelId: query.channelId,
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
    store: StoreT,
    query: {
        channelId: string
        columnIndex?: number
    }
): Promise<[StoreT, WebAPI.Response | null]> => {
    const [nextDomainData, response] = await _fetch(store.domainData, {
        channelId: query.channelId,
    })
    const { channel, statuses } = response
    const columnIndex = query.columnIndex ? query.columnIndex : store.appState.columns.length

    const column: ColumnStateT = {
        index: columnIndex,
        type: ColumnTypes.Channel,
        postbox: {
            enabled: true,
            query: {
                channelId: channel.id,
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

    const nextAppState: AppStateT = {
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
    store: StoreT,
    query: {
        channelId?: string
        maxId?: string
        sinceId?: string
        maxDate?: string
        untilDate?: string
    }
): Promise<[StoreT, WebAPI.Response | null]> => {
    const [nextDomainData, response] = await fetch(store.domainData, WebAPI.timeline.channel, {
        channelId: query.channelId,
    })
    const { statuses } = response

    const nextAppState: AppStateT = {
        columns: store.appState.columns.map(
            (column): ColumnStateT => {
                return {
                    index: column.index,
                    type: column.type,
                    postbox: {
                        enabled: column.postbox.enabled,
                        query: Object.assign({}, column.postbox.query),
                    },
                    timeline: {
                        statusIds: column.timeline.statusIds.concat(),
                        query: Object.assign({}, column.timeline.query),
                    },
                    context: Object.assign({}, column.context),
                }
            }
        ),
    }

    nextAppState.columns.forEach((column) => {
        if (column.type !== ColumnTypes.Channel) {
            return
        }
        if (equals(query, column.timeline.query) !== true) {
            return
        }
        column.timeline.statusIds = statuses.map((status) => status.id)
    })

    return [
        {
            domainData: nextDomainData,
            appState: nextAppState,
        },
        response,
    ]
}
