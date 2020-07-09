import { CommunityObject, ChannelObject, StatusObject } from "../../api/object"
import { useState, createContext } from "react"
import * as WebAPI from "../../api"
import { update } from "../../api/methods/statuses/update"

export const ColumnType = {
    Global: "Global",
    Community: "Community",
    Channel: "Channel",
    Thread: "Thread",
} as const

export type ColumnState = {
    index: number
    type: keyof typeof ColumnType
    postbox: {
        enabled: boolean
        query: any
    }
    context: {
        community?: CommunityObject
        channel?: ChannelObject
        status?: StatusObject
    }
    timeline: {
        statuses: StatusObject[]
    }
}

const fetchChannelColumn = async (
    channelId: string,
    columnIndex: number
): Promise<ColumnState> => {
    const channel = (
        await WebAPI.channels.show({
            channel_id: channelId,
        })
    ).channel as ChannelObject

    const statuses = (
        await WebAPI.timeline.channel({
            channel_id: channelId,
        })
    ).statuses as StatusObject[]

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
            channel: channel,
            community: channel.community,
        },
        timeline: {
            statuses: statuses,
        },
    }
    return column
}

const updateChannelColumnTimeline = async (column: ColumnState) => {
    const statuses = (
        await WebAPI.timeline.channel({
            channel_id: column.context.channel.id,
        })
    ).statuses as StatusObject[]
    column.timeline.statuses = statuses
    return column
}

const updateColumnTimeline = async (column: ColumnState) => {
    if (column.type == "Channel") {
        return await updateChannelColumnTimeline(column)
    }
    return null
}

const context: {
    columns: ColumnState[]
    handleUpdateColumnTimeline: (column: ColumnState) => Promise<void>
} = {
    columns: [],
    handleUpdateColumnTimeline: null,
}

export const ChatUIStateContext = createContext(context)

export const useChatUIState = ({
    context,
}: {
    context: {
        channelId?: string
        communityId?: string
        statusId?: string
        userId?: string
    }
}) => {
    const [needsInitialize, setNeedsInitialize] = useState(true)
    const [columnList, setColumnList] = useState<ColumnState[]>([])
    const handleUpdateColumnTimeline = async (column: ColumnState) => {
        const newColumn = await updateColumnTimeline(column)
        const newColumnList = columnList.map((column) => column)
        newColumnList[newColumn.index] = newColumn
        setColumnList(newColumnList)
    }
    if (needsInitialize) {
        if (context.channelId) {
            fetchChannelColumn(context.channelId, columnList.length)
                .then((column) => {
                    const newColumns = columnList.concat(column)
                    setColumnList(newColumns)
                })
                .catch((error) => {})
        }
        setNeedsInitialize(false)
    }
    return {
        columns: columnList,
        handleUpdateColumnTimeline,
    }
}
