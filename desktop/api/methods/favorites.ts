import { Response, UnexpectedResponseError, post } from "../fetch"

async function create(body: { messageId: number }): Promise<Response> {
    const responce = await post("favorites/create", {
        status_id: body.messageId,
    })
    if (responce.message == null) {
        throw new UnexpectedResponseError()
    }
    return responce
}

async function destroy(body: { messageId: number }): Promise<Response> {
    const responce = await post("favorites/destroy", {
        status_id: body.messageId,
    })
    if (responce.message == null) {
        throw new UnexpectedResponseError()
    }
    return responce
}

export const favorites = {
    create,
    destroy,
}
