import { Response, post, UnexpectedResponseError } from "../../classes"

type Arguments = {
    status_id: string
}

export async function like(body: Arguments): Promise<Response> {
    const responce = await post("statuses/like", body)
    if (responce.status == null) {
        throw new UnexpectedResponseError()
    }
    return responce
}
