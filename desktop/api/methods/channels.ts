import { Response, post, get } from "../classes"

function create(body: {
    name: string
    description: string
    is_public: boolean
    community_id?: string
}): Promise<Response> {
    return post("channels/create", body)
}

async function show(query: { channel_id: string }): Promise<Response> {
    const responce = await get("channels/show", query)
    if (responce.channel == null) {
        throw new UnexpectedResponseError()
    }
    return responce
}

export const channels = {
    show,
    create,
}
