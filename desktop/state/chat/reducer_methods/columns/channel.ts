import { ColumnTypes, ColumnStateT, AppStateT } from "../../state/app"
import { fetch } from "../../state/data"
import { DomainDataT } from "../../state/data/types"
import { StoreT } from "../../state/reducer"
import * as WebAPI from "../../../../api"
import { ChannelObjectT, StatusObjectT } from "../../../../api/object"

const _fetch = (
    prevDomainData: DomainDataT,
    query: Parameters<typeof WebAPI.timeline.channel>[0]
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
                    includeComments: !!query.includeComments,
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
        insertColumnAfter?: number
    }
): Promise<[StoreT, WebAPI.Response | null]> => {
    const timelineQuery = {
        channelId: query.channelId,
        includeComments: true,
    }
    const [nextDomainData, response] = await _fetch(store.domainData, timelineQuery)
    const { channel, statuses } = response
    const columnIndex = store.appState.columns.length

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
            query: timelineQuery,
        },
    }

    const insertColumnAfter = Number.isInteger(query.insertColumnAfter)
        ? query.insertColumnAfter
        : columnIndex
    const nextColumns = []
    for (let index = 0; index < insertColumnAfter; index++) {
        nextColumns.push(store.appState.columns[index])
    }
    nextColumns.push(column)
    for (let index = insertColumnAfter; index < store.appState.columns.length; index++) {
        nextColumns.push(store.appState.columns[index])
    }

    const nextAppState: AppStateT = {
        columns: nextColumns,
    }

    return [
        {
            domainData: nextDomainData,
            appState: nextAppState,
        },
        null,
    ]
}

function findColumnByIndex(columns: ColumnStateT[], index: number): ColumnStateT | null {
    for (let n = 0; n < columns.length; n++) {
        const column = columns[n]
        if (column.index === index) {
            return column
        }
    }
    return null
}

export const updateTimeline = async (
    store: StoreT,
    prevTargetColumn: ColumnStateT
): Promise<[StoreT, WebAPI.Response | null]> => {
    const [nextDomainData, response] = await fetch(store.domainData, WebAPI.timeline.channel, {
        channelId: prevTargetColumn.timeline.query.channelId,
        includeComments: !!prevTargetColumn.timeline.query.includeComments,
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
    const nextTargetColumn = findColumnByIndex(nextAppState.columns, prevTargetColumn.index)
    if (nextTargetColumn) {
        nextTargetColumn.timeline.statusIds = statuses.map((status) => status.id)
    }

    return [
        {
            domainData: nextDomainData,
            appState: nextAppState,
        },
        response,
    ]
}

export const setTimelineQuery = async (
    store: StoreT,
    params: {
        column: ColumnStateT
        query: ColumnStateT["timeline"]["query"]
    }
): Promise<[StoreT, WebAPI.Response | null]> => {
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

    const [nextDomainData, response] = await fetch(store.domainData, WebAPI.timeline.channel, {
        channelId: params.query.channelId,
        includeComments: !!params.query.includeComments,
    })

    const column = findColumnByIndex(nextAppState.columns, params.column.index)
    column.timeline.query = params.query
    column.timeline.statusIds = response.statuses.map((status) => status.id)

    return [
        {
            domainData: nextDomainData,
            appState: nextAppState,
        },
        response,
    ]
}
