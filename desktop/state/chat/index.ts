import { useChatAppState, ColumnType, ColumnState, AppState } from "./app"
import { useChatDomainData, DomainData } from "./data"
import * as WebAPI from "../../api"
import { useState } from "react"

const fetchChannelColumn = async ({
    channelId,
    columnIndex,
    domainData,
}: {
    channelId: string
    columnIndex: number
    domainData: DomainData
}): Promise<ColumnState> => {
    const { channel } = await domainData.reduce(WebAPI.channels.show, {
        channel_id: channelId,
    })
    const { statuses } = await domainData.reduce(WebAPI.timeline.channel, {
        channel_id: channelId,
    })

    const column: ColumnState = {
        index: columnIndex,
        type: ColumnType.Channel,
        postbox: {
            enabled: true,
            query: {
                channel_id: channelId,
            },
        },
        context: {
            channel_id: channel.id,
            community_id: channel.community_id,
        },
        timeline: {
            status_ids: statuses.map((status) => status.id),
        },
    }
    return column
}

const updateChannelColumnTimeline = async ({
    column,
    domainData,
}: {
    column: ColumnState
    domainData: DomainData
}) => {
    const { statuses } = await domainData.reduce(WebAPI.timeline.channel, {
        channel_id: column.context.channel_id,
    })
    column.timeline.status_ids = statuses.map((status) => status.id)
    return column
}

const updateColumnTimeline = async ({
    column,
    domainData,
}: {
    column: ColumnState
    domainData: DomainData
}) => {
    if (column.type == "Channel") {
        return await updateChannelColumnTimeline({ column, domainData })
    }
    return null
}

export const useChatStore = ({
    context,
}: {
    context: {
        channelId?: string
        communityId?: string
        statusId?: string
        userId?: string
    }
}) => {
    console.info("useChatState")
    const domainData = useChatDomainData()
    const appState = useChatAppState({ context })
    const [needsInitialize, setNeedsInitialize] = useState(true)

    if (needsInitialize) {
        if (context.channelId) {
            fetchChannelColumn({
                channelId: context.channelId,
                columnIndex: appState.columns.length,
                domainData: domainData,
            })
                .then((column) => {
                    const newColumns = appState.columns.concat(column)
                    appState.setColumns(newColumns)
                })
                .catch((error) => {})
        }
        setNeedsInitialize(false)
    }

    return {
        domainData,
        appState,
        updateColumnTimeline: async (column: ColumnState) => {
            const newColumn = await updateColumnTimeline({ column, domainData })
            const newColumnList = appState.columns.map((column) => column)
            newColumnList[newColumn.index] = newColumn
            appState.setColumns(newColumnList)
        },
    }
}
