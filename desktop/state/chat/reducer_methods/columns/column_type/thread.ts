import * as WebAPI from "../../../../../api"

import { AppStateT, ColumnStateT, ColumnTypes } from "../../../state/app"

import { AbstractColumnActions } from "../class"
import { DomainDataT } from "../../../state/data/types"
import { StatusObjectT } from "../../../../../api/object"
import { StoreT } from "../../../state/reducer"
import { fetch } from "../../../state/data"

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
                fetch(
                    prevDomainData,
                    WebAPI.timeline.thread,
                    Object.assign(
                        {
                            statusId: query.statusId,
                        },
                        query
                    )
                )
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

class ColumnActions extends AbstractColumnActions {
    create = async (
        store: StoreT,
        params: {
            statusId: string
            insertColumnAfter?: number
        }
    ): Promise<[StoreT, WebAPI.Response | null]> => {
        const [nextDomainData, response] = await _fetch(store.domainData, {
            statusId: params.statusId,
        })
        const { status, statuses } = response
        const { channel } = status
        const columnKey = Date.now()

        const column: ColumnStateT = {
            id: columnKey,
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
            options: {
                showMutedStatuses: false,
            },
            timeline: {
                statusIds: statuses.map((status) => status.id),
                query: {
                    statusId: params.statusId,
                },
            },
        }

        const nextAppState: AppStateT = {
            columns: this.insert(column, store.appState.columns, params.insertColumnAfter),
        }

        return [
            {
                domainData: nextDomainData,
                appState: nextAppState,
            },
            null,
        ]
    }
    setTimelineQuery = async (
        store: StoreT,
        params: {
            column: ColumnStateT
            query: ColumnStateT["timeline"]["query"]
        }
    ): Promise<[StoreT, WebAPI.Response | null]> => {
        const nextAppState: AppStateT = {
            columns: this.copyColumns(store.appState.columns),
        }

        const [nextDomainData, response] = await fetch(
            store.domainData,
            WebAPI.timeline.thread,
            Object.assign({ statusId: params.query.statusId }, params.query)
        )

        const column = this.findByIndex(nextAppState.columns, params.column.id)
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
    updateTimeline = async (
        store: StoreT,
        desiredColumn: ColumnStateT
    ): Promise<[StoreT, WebAPI.Response | null]> => {
        const [nextDomainData, response] = await fetch(
            store.domainData,
            WebAPI.timeline.thread,
            Object.assign(
                {
                    statusId: desiredColumn.timeline.query.statusId,
                },
                desiredColumn.timeline.query
            )
        )
        const { statuses } = response

        const nextAppState: AppStateT = {
            columns: this.copyColumns(store.appState.columns),
        }
        const nextTargetColumn = this.findByIndex(nextAppState.columns, desiredColumn.id)
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
}

export const thread = new ColumnActions()
