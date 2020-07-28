import * as channel from "./columns/channel"
import * as thread from "./columns/thread"

import { ColumnStateT, AppStateT } from "../state/app"
import { StoreT } from "../state/reducer"

function findColumnByIndex(columns: ColumnStateT[], index: number): ColumnStateT | null {
    for (let n = 0; n < columns.length; n++) {
        const column = columns[n]
        if (column.index === index) {
            return column
        }
    }
    return null
}

const setOptions = async (
    store: StoreT,
    params: {
        column: ColumnStateT
        options: ColumnStateT["options"]
    }
): Promise<[StoreT, null]> => {
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
        ),
    }

    const column = findColumnByIndex(nextAppState.columns, params.column.index)
    column.options = params.options

    return [
        {
            domainData: store.domainData,
            appState: nextAppState,
        },
        null,
    ]
}

export const columns = { channel, thread, setOptions }
