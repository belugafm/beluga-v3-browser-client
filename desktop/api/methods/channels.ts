import { Response, UnexpectedResponseError, get, post } from "../classes"

function create(body: { name: string; parentChannelGroupId: number }): Promise<Response> {
    return post("channels/create", {
        name: body.name,
        parent_channel_group_id: body.parentChannelGroupId,
    })
}

async function show(query: { channelId: string }): Promise<Response> {
    const responce = await get("channels/show", {
        channel_id: query.channelId,
    })
    if (responce.channel == null) {
        throw new UnexpectedResponseError()
    }
    return responce
}

export const channels = {
    show,
    create,
}
