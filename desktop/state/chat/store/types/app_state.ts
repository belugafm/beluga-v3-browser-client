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
        channelGroupId?: number
        channelId?: number
        messageId?: number
    }
    options: {
        showMutedMessage: boolean
    }
    timeline: {
        lastMessageId: number
        messageIds: number[]
        shouldFetch: boolean // 自動更新するかどうか
        upToDate: boolean // 最新のメッセージがmessageIdsに含まれるかどうか
        query: {
            channelGroupId?: number
            channelId?: number
            messageId?: number
            maxId?: number
            sinceId?: number
            maxDate?: number
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
