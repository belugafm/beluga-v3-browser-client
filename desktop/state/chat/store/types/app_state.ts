import { ChannelGroupId, ChannelId, MessageId } from "../../../../api/object"

export const ContentType = {
    ChannelGroup: "ChannelGroup",
    Channel: "Channel",
    Thread: "Thread",
} as const

export type ContentStateT = {
    id: number
    column: number
    row: number
    type: keyof typeof ContentType
    postbox: {
        enabled: boolean
        query: any
    }
    context: {
        channelGroupId?: ChannelGroupId
        channelId?: ChannelId
        messageId?: MessageId
    }
    options: {
        showMutedMessage: boolean
    }
    timeline: {
        lastMessageId: MessageId
        messageIds: MessageId[]
        shouldFetch: boolean // 自動更新するかどうか
        upToDate: boolean // 最新のメッセージがmessageIdsに含まれるかどうか
        query: {
            channelGroupId?: ChannelGroupId
            channelId?: ChannelId
            messageId?: MessageId
            maxId?: MessageId
            sinceId?: MessageId
            maxDate?: MessageId
            untilDate?: number
            limit?: number
        }
    }
}

export type AppStateT = {
    contents: ContentStateT[][]
}

export type AppStateSetActionT = {
    setContents: (contents: ContentStateT[][]) => void
    addContentToNewColumn: (content: ContentStateT) => void
    insertContentBetweenColumn: (content: ContentStateT, beforeColumn: number) => void
    insertContentBetweenRow: (content: ContentStateT, column: number, beforeRow: number) => void
    removeContent: (content: ContentStateT) => void
}
