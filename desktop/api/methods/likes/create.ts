import { Response, post, UnexpectedResponseError } from "../../classes"

type Arguments = {
    status_id: string
}

export async function create(body: Arguments): Promise<Response> {
    const responce = await post("likes/create", body)
    if (responce.status == null) {
        throw new UnexpectedResponseError()
    }
    return responce
}
