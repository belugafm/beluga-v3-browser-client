import { post, Response, UnexpectedResponseError } from "../classes"

async function create(body: { status_id: string }): Promise<Response> {
    const responce = await post("mutes/create", body)
    if (responce.user == null) {
        throw new UnexpectedResponseError()
    }
    return responce
}

async function destroy(body: { status_id: string }): Promise<Response> {
    const responce = await post("mutes/destroy", body)
    if (responce.user == null) {
        throw new UnexpectedResponseError()
    }
    return responce
}

export const mutes = {
    create,
    destroy,
}
