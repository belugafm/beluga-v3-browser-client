import { ColumnTypes, ColumnStateT, AppStateT } from "../../../state/app"
import { fetch } from "../../../state/data"
import { DomainDataT } from "../../../state/data/types"
import { StoreT } from "../../../state/reducer"
import * as WebAPI from "../../../../../api"
import { ChannelObjectT, StatusObjectT } from "../../../../../api/object"
import { AbstractColumnActions } from "../class"

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

class ColumnActions extends AbstractColumnActions {
    create = async (
        store: StoreT,
        query: {
            channelId: string
            insertColumnAfter?: number
        }
    ): Promise<[StoreT, WebAPI.Response | null]> => {
        const timelineQuery = {
            channelId: query.channelId,
            includeComments: false,
        }
        const [nextDomainData, response] = await _fetch(store.domainData, timelineQuery)
        const { channel, statuses } = response
        const columnId = Date.now()

        const column: ColumnStateT = {
            id: columnId,
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
            options: {
                showMutedStatuses: false,
            },
            timeline: {
                statusIds: statuses.map((status) => status.id),
                query: timelineQuery,
            },
        }

        const nextAppState: AppStateT = {
            columns: this.insert(column, store.appState.columns, query.insertColumnAfter),
        }

        return [
            {
                domainData: nextDomainData,
                appState: nextAppState,
            },
            null,
        ]
    }

    updateTimeline = async (
        store: StoreT,
        desiredColumn: ColumnStateT
    ): Promise<[StoreT, WebAPI.Response | null]> => {
        const [nextDomainData, response] = await fetch(store.domainData, WebAPI.timeline.channel, {
            channelId: desiredColumn.timeline.query.channelId,
            includeComments: !!desiredColumn.timeline.query.includeComments,
        })
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

export const channel = new ColumnActions()
