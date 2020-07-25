import { post, Response, UnexpectedResponseError } from "../classes"

async function create(body: { statusId: string }): Promise<Response> {
    const responce = await post("favorites/create", {
        status_id: body.statusId,
    })
    if (responce.status == null) {
        throw new UnexpectedResponseError()
    }
    return responce
}

async function destroy(body: { statusId: string }): Promise<Response> {
    const responce = await post("favorites/destroy", {
        status_id: body.statusId,
    })
    if (responce.status == null) {
        throw new UnexpectedResponseError()
    }
    return responce
}

export const favorites = {
    create,
    destroy,
}
