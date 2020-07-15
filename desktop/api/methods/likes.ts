import { post, Response } from "../classes"

async function create(body: { status_id: string }): Promise<Response> {
    const responce = await post("likes/create", body)
    if (responce.status == null) {
        throw new UnexpectedResponseError()
    }
    return responce
}

export const likes = {
    create,
}
