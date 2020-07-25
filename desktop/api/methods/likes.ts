import { post, Response, UnexpectedResponseError } from "../classes"

async function create(body: { statusId: string }): Promise<Response> {
    const responce = await post("likes/create", {
        status_id: body.statusId,
    })
    if (responce.status == null) {
        throw new UnexpectedResponseError()
    }
    return responce
}

export const likes = {
    create,
}
