import * as api from "../../../../../api"

import { AppStateT, ColumnStateT, ColumnTypes } from "../../../store/app_state"

import { AbstractColumnActions } from "./class"
import { DomainDataT } from "../../../store/domain_data/types"
import { MessageObjectT } from "../../../../../api/object"
import { StoreT } from "../../../store/reducer"
import { fetch } from "../../../store/domain_data"

const _fetch = (
    prevDomainData: DomainDataT,
    query: Parameters<typeof api.message.show>[0]
): Promise<
    [
        DomainDataT,
        {
            status: MessageObjectT
            statuses: MessageObjectT[]
        }
    ]
> => {
    return new Promise((resolve, reject) => {
        fetch(prevDomainData, api.message.show, {
            messageId: query.messageId,
        })
            .then(([nextDomainData, response]) => {
                const prevDomainData = nextDomainData
                const { message: status } = response
                fetch(
                    prevDomainData,
                    api.timeline.thread,
                    Object.assign(
                        {
                            messageId: query.messageId,
                        },
                        query
                    )
                )
                    .then(([nextDomainData, response]) => {
                        const { messages: statuses } = response
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
    asyncAdd = async (
        store: StoreT,
        params: {
            messageId: number
            insertColumnAfter?: number
        }
    ): Promise<[StoreT, api.Response | null]> => {
        const [nextDomainData, response] = await _fetch(store.domainData, {
            messageId: params.messageId,
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
                messageId: status.id,
                channelGroupId: channel.community_id,
            },
            options: {
                showMutedStatuses: false,
            },
            timeline: {
                messageIds: statuses.map((status) => status.id),
                query: {
                    messageId: params.messageId,
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
    ): Promise<[StoreT, api.Response | null]> => {
        const nextAppState: AppStateT = {
            columns: this.copyColumns(store.appState.columns),
        }

        const [nextDomainData, response] = await fetch(
            store.domainData,
            api.timeline.thread,
            Object.assign({ messageId: params.query.messageId }, params.query)
        )

        const column = this.findByIndex(nextAppState.columns, params.column.id)
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
    updateTimeline = async (
        store: StoreT,
        desiredColumn: ColumnStateT
    ): Promise<[StoreT, api.Response | null]> => {
        const [nextDomainData, response] = await fetch(
            store.domainData,
            api.timeline.thread,
            Object.assign(
                {
                    messageId: desiredColumn.timeline.query.messageId,
                },
                desiredColumn.timeline.query
            )
        )
        const { messages: statuses } = response

        const nextAppState: AppStateT = {
            columns: this.copyColumns(store.appState.columns),
        }
        const nextTargetColumn = this.findByIndex(nextAppState.columns, desiredColumn.id)
        if (nextTargetColumn) {
            nextTargetColumn.timeline.messageIds = statuses.map((status) => status.id)
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
