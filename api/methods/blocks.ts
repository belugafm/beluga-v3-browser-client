import { Response, UnexpectedResponseError, post } from "../fetch"
import { UserId } from "../object"

async function create(body: { userId: UserId }): Promise<Response> {
    const responce = await post("blocks/create", {
        user_id: body.userId,
    })
    if (responce.user == null) {
        throw new UnexpectedResponseError()
    }
    return responce
}

async function destroy(body: { userId: UserId }): Promise<Response> {
    const responce = await post("blocks/destroy", {
        user_id: body.userId,
    })
    if (responce.user == null) {
        throw new UnexpectedResponseError()
    }
    return responce
}

export const blocks = {
    create,
    destroy,
}
