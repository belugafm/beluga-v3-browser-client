import { Response, UnexpectedResponseError, post } from "../fetch"

async function create(body: { messageId: number }): Promise<Response> {
    const responce = await post("likes/create", {
        status_id: body.messageId,
    })
    if (responce.message == null) {
        throw new UnexpectedResponseError()
    }
    return responce
}

export const likes = {
    create,
}
