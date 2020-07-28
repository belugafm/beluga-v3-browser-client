import { ColumnStateT, AppStateT } from "../../state/app"
import { fetch } from "../../state/data"
import { StoreT } from "../../state/reducer"
import * as WebAPI from "../../../../api"

export abstract class AbstractColumnActions {
    splitColumns = (columns: ColumnStateT[], splitId) => {
        const before = []
        const after = []
        let stack = before
        columns.forEach((column) => {
            stack.push(column)
            if (column.id === splitId) {
                stack = after
            }
        })
        return [before, after]
    }
    copyColumns = (columns: ColumnStateT[]) => {
        return columns.map(
            (column): ColumnStateT => {
                return {
                    id: column.id,
                    type: column.type,
                    postbox: {
                        enabled: column.postbox.enabled,
                        query: Object.assign({}, column.postbox.query),
                    },
                    options: {
                        showMutedStatuses: column.options.showMutedStatuses,
                    },
                    timeline: {
                        statusIds: column.timeline.statusIds.concat(),
                        query: Object.assign({}, column.timeline.query),
                    },
                    context: Object.assign({}, column.context),
                }
            }
        )
    }
    findByIndex = (columns: ColumnStateT[], index: number): ColumnStateT | null => {
        for (let n = 0; n < columns.length; n++) {
            const column = columns[n]
            if (column.id === index) {
                return column
            }
        }
        return null
    }
    insert = (
        column: ColumnStateT,
        columns: ColumnStateT[],
        insertColumnAfter: number
    ): ColumnStateT[] => {
        if (columns.length === 0) {
            return [column]
        }

        insertColumnAfter = Number.isInteger(insertColumnAfter)
            ? insertColumnAfter
            : columns[columns.length - 1].id
        const [before, after] = this.splitColumns(columns, insertColumnAfter)

        const nextColumns = []
        before.forEach((column) => nextColumns.push(column))
        nextColumns.push(column)
        after.forEach((column) => nextColumns.push(column))

        return nextColumns
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

        const [nextDomainData, response] = await fetch(store.domainData, WebAPI.timeline.channel, {
            channelId: params.query.channelId,
            includeComments: !!params.query.includeComments,
        })

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
    setOptions = async (
        store: StoreT,
        params: {
            column: ColumnStateT
            options: ColumnStateT["options"]
        }
    ): Promise<[StoreT, null]> => {
        const nextAppState: AppStateT = {
            columns: this.copyColumns(store.appState.columns),
        }

        const column = this.findByIndex(nextAppState.columns, params.column.id)
        column.options = params.options

        return [
            {
                domainData: store.domainData,
                appState: nextAppState,
            },
            null,
        ]
    }
    close = async (store: StoreT, desiredColumn: ColumnStateT): Promise<[StoreT, null]> => {
        const nextAppState: AppStateT = {
            columns: this.copyColumns(
                store.appState.columns.filter((column) => column.id !== desiredColumn.id)
            ),
        }

        return [
            {
                domainData: store.domainData,
                appState: nextAppState,
            },
            null,
        ]
    }
    abstract async create(
        store: StoreT,
        query: Record<string, any>
    ): Promise<[StoreT, WebAPI.Response | null]>
    abstract async updateTimeline(
        store: StoreT,
        prevTargetColumn: ColumnStateT
    ): Promise<[StoreT, WebAPI.Response | null]>
}
