import { post, Response, UnexpectedResponseError } from "../classes"

async function create(body: { status_id: string }): Promise<Response> {
    const responce = await post("favorites/create", body)
    if (responce.status == null) {
        throw new UnexpectedResponseError()
    }
    return responce
}

async function destroy(body: { status_id: string }): Promise<Response> {
    const responce = await post("favorites/destroy", body)
    if (responce.status == null) {
        throw new UnexpectedResponseError()
    }
    return responce
}

export const favorites = {
    create,
    destroy,
}
