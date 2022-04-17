import { Response, UnexpectedResponseError, post } from "../fetch"

async function create(body: { userId: number }): Promise<Response> {
    const responce = await post("mutes/create", {
        user_id: body.userId,
    })
    if (responce.user == null) {
        throw new UnexpectedResponseError()
    }
    return responce
}

async function destroy(body: { userId: number }): Promise<Response> {
    const responce = await post("mutes/destroy", {
        user_id: body.userId,
    })
    if (responce.user == null) {
        throw new UnexpectedResponseError()
    }
    return responce
}

export const mutes = {
    create,
    destroy,
}
