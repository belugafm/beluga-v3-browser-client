import { Response, UnexpectedResponseError, post } from "../fetch"
import { MessageId } from "../object"

async function create(body: { messageId: MessageId }): Promise<Response> {
    const responce = await post("favorites/create", {
        message_id: body.messageId,
    })
    if (responce.message == null) {
        throw new UnexpectedResponseError()
    }
    return responce
}

async function destroy(body: { messageId: MessageId }): Promise<Response> {
    const responce = await post("favorites/destroy", {
        message_id: body.messageId,
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
