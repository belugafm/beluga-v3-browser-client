import { Response, UnexpectedResponseError, get, post } from "../classes"

export async function update(body: {
    text: string
    channelId?: string
    threadStatusId?: string
}): Promise<Response> {
    const responce = await post("statuses/update", {
        text: body.text,
        channel_id: body.channelId,
        thread_status_id: body.threadStatusId,
    })
    if (responce.status == null) {
        throw new UnexpectedResponseError()
    }
    return responce
}

async function destroy(body: { statusId: string }): Promise<Response> {
    return await post("statuses/destroy", {
        status_id: body.statusId,
    })
}

async function show(body: { statusId: string }): Promise<Response> {
    try {
        const response = await get("statuses/show", {
            status_id: body.statusId,
        })
        return response
    } catch (error) {}
}

export const statuses = {
    show,
    update,
    destroy,
}
