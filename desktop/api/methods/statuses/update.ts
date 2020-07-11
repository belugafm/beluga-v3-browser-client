import { Response, post, UnexpectedResponseError } from "../../classes"

type Arguments = {
    text: string
    channel_id?: string
    thread_status_id?: string
}

export async function update(body: Arguments): Promise<Response> {
    const responce = await post("statuses/update", body)
    if (responce.status == null) {
        throw new UnexpectedResponseError()
    }
    return responce
}
