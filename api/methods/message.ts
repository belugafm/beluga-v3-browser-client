import * as fetch from "../fetch"

import { Response, UnexpectedResponseError, get } from "../fetch"
import { MessageId } from "../object"

export const message = {
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
}
