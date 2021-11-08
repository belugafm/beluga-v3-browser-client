import { Response, UnexpectedResponseError, post } from "../classes"

async function create(body: { userId: string }): Promise<Response> {
    const responce = await post("mutes/create", {
        user_id: body.userId,
    })
    if (responce.user == null) {
        throw new UnexpectedResponseError()
    }
    return responce
}

async function destroy(body: { userId: string }): Promise<Response> {
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
