import { Response, post } from "../../classes"

type Arguments = {
    status_id: string
}

export async function destroy(body: Arguments): Promise<Response> {
    return await post("statuses/destroy", body)
}
