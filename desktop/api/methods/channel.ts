import { Response, UnexpectedResponseError, get, post } from "../fetch"

function create(body: { name: string; parentChannelGroupId: number }): Promise<Response> {
    return post("channel/create", {
        name: body.name,
        parent_channel_group_id: body.parentChannelGroupId,
    })
}

function buildPayload(query: { id?: number; uniqueName?: string }) {
    if (query.id) {
        return { id: query.id }
    }
    if (query.uniqueName) {
        return { unique_name: query.uniqueName }
    }
    return {}
}

async function show(query: { id?: number; uniqueName?: string }): Promise<Response> {
    if (query.id == null && query.uniqueName == null) {
        throw new UnexpectedResponseError()
    }
    const responce = await get("channel/show", buildPayload(query))
    if (responce.channel == null) {
        throw new UnexpectedResponseError()
    }
    return responce
}

export const channel = {
    show,
    create,
}
