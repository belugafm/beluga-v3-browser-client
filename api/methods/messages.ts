import * as fetch from "../fetch"

import { Response, get } from "../fetch"
import { MessageId } from "../object"

export const SortBy = {
    CreatedAt: "CreatedAt",
} as const

export const SortOrder = {
    Ascending: "Ascending",
    Descending: "Descending",
} as const

export type MessageSearchQueryT = {
    text: string
    channelId?: number
    userId?: number
    sinceId?: number
    maxId?: number
    sinceDate?: number
    untilDate?: number
    limit?: number
    sortBy?: typeof SortBy[keyof typeof SortBy]
    sortOrder?: typeof SortOrder[keyof typeof SortOrder]
}

export const messages = {
    post: async (query: {
        text: string
        textStyle?: string
        channelId?: number
        threadId?: number
    }): Promise<Response> => {
        const responce = await fetch.post("message/post", {
            text: query.text,
            text_style: query.textStyle,
            channel_id: query.channelId,
            thread_id: query.threadId,
        })
        return responce
    },
    delete: async (query: { messageId: MessageId }): Promise<Response> => {
        return await fetch.post("message/delete", {
            id: query.messageId,
        })
    },
    show: async (query: { messageId: MessageId }): Promise<Response> => {
        try {
            const response = await get("message/show", {
                id: query.messageId,
            })
            return response
        } catch (error) {}
    },
    search: async (query: MessageSearchQueryT): Promise<Response> => {
        try {
            const response = await get("message/search", {
                text: query.text,
                channelId: query.channelId,
                userId: query.userId,
                sinceId: query.sinceId,
                maxId: query.maxId,
                sinceDate: query.sinceDate,
                untilDate: query.untilDate,
                limit: query.limit,
                sortBy: query.sortBy,
                sortOrder: query.sortOrder,
            })
            return response
        } catch (error) {}
    },
}
