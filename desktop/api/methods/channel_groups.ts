import { Response, UnexpectedResponseError, get, post } from "../classes"

function create(body: { name: string; parentId: number }): Promise<Response> {
    return post("channel_groups/create", {
        name: body.name,
        parent_id: body.parentId,
    })
}

async function show(query: { channelId: string }): Promise<Response> {
    const responce = await get("channel_groups/show", {
        channel_id: query.channelId,
    })
    if (responce.channel == null) {
        throw new UnexpectedResponseError()
    }
    return responce
}

export const channelGroups = {
    show,
    create,
}
