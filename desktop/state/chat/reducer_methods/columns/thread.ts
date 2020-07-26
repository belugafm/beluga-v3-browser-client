import { ColumnTypes, ColumnStateT, AppStateT } from "../../state/app"
import { DomainDataT, fetch } from "../../state/data"
import { StoreT } from "../../reducer"
import * as WebAPI from "../../../../api"
import { StatusObjectT } from "../../../../api/object"
import equals from "deep-equal"

const _fetch = (
    prevDomainData: DomainDataT,
    query: Parameters<typeof WebAPI.statuses.show>[0]
): Promise<
    [
        DomainDataT,
        {
            status: StatusObjectT
            statuses: StatusObjectT[]
        }
    ]
> => {
    return new Promise((resolve, reject) => {
        fetch(prevDomainData, WebAPI.statuses.show, {
            statusId: query.statusId,
        })
            .then(([nextDomainData, response]) => {
                const prevDomainData = nextDomainData
                const { status } = response
                fetch(prevDomainData, WebAPI.timeline.thread, {
                    statusId: query.statusId,
                })
                    .then(([nextDomainData, response]) => {
                        const { statuses } = response
                        resolve([
                            nextDomainData,
                            {
                                status,
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
        statusId: string
        columnIndex?: number
    }
): Promise<[StoreT, WebAPI.Response | null]> => {
    const [nextDomainData, response] = await _fetch(store.domainData, {
        statusId: query.statusId,
    })
    const { status, statuses } = response
    const { channel } = status
    const columnIndex = query.columnIndex ? query.columnIndex : store.appState.columns.length

    const column: ColumnStateT = {
        index: columnIndex,
        type: ColumnTypes.Thread,
        postbox: {
            enabled: true,
            query: {
                threadStatusId: status.id,
            },
        },
        context: {
            statusId: status.id,
            communityId: channel.community_id,
        },
        timeline: {
            statusIds: statuses.map((status) => status.id),
            query: {
                statusId: query.statusId,
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
        statusId?: string
        maxId?: string
        sinceId?: string
        maxDate?: string
        untilDate?: string
    }
): Promise<[StoreT, WebAPI.Response | null]> => {
    const [nextDomainData, response] = await fetch(store.domainData, WebAPI.timeline.thread, {
        statusId: query.statusId,
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
        if (column.type !== ColumnTypes.Thread) {
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
