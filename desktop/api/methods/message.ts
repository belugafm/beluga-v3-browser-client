import * as fetch from "../fetch"

import { Response, UnexpectedResponseError, get } from "../fetch"

export async function post(query: {
    text: string
    channelId?: number
    threadId?: number
}): Promise<Response> {
    const responce = await fetch.post("message/post", {
        text: query.text,
        channel_id: query.channelId,
        thread_id: query.threadId,
    })
    if (responce.message == null) {
        throw new UnexpectedResponseError()
    }
    return responce
}

async function destroy(query: { messageId: number }): Promise<Response> {
    return await fetch.post("message/destroy", {
        id: query.messageId,
    })
}

async function show(query: { messageId: number }): Promise<Response> {
    try {
        const response = await get("message/show", {
            id: query.messageId,
        })
        return response
    } catch (error) {}
}

export const message = {
    show,
    post,
    destroy,
}
