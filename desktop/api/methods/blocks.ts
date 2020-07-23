import { post, Response, UnexpectedResponseError } from "../classes"

async function create(body: { status_id: string }): Promise<Response> {
    const responce = await post("blocks/create", body)
    if (responce.user == null) {
        throw new UnexpectedResponseError()
    }
    return responce
}

async function destroy(body: { status_id: string }): Promise<Response> {
    const responce = await post("blocks/destroy", body)
    if (responce.user == null) {
        throw new UnexpectedResponseError()
    }
    return responce
}

export const blocks = {
    create,
    destroy,
}
