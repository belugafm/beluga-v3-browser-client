import { Response, post, UnexpectedResponseError, get } from "../classes"

export async function update(body: {
    text: string
    channel_id?: string
    thread_status_id?: string
}): Promise<Response> {
    const responce = await post("statuses/update", body)
    if (responce.status == null) {
        throw new UnexpectedResponseError()
    }
    return responce
}

async function destroy(body: { status_id: string }): Promise<Response> {
    return await post("statuses/destroy", body)
}

async function show(body: { status_id: string }): Promise<Response> {
    try {
        const response = await get("statuses/show", body)
        return response
    } catch (error) {}
}

export const statuses = {
    show,
    update,
    destroy,
}
