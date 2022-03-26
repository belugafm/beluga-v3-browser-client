import { Response, UnexpectedResponseError, get, post } from "../fetch"

function create(body: { name: string; parentId: number }): Promise<Response> {
    return post("channel_group/create", {
        name: body.name,
        parent_id: body.parentId,
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
    const responce = await get("channel_group/show", buildPayload(query))
    if (responce.channel_group == null) {
        throw new UnexpectedResponseError()
    }
    return responce
}

function listChannels(id: number): Promise<Response> {
    return get("channel_group/list_channels", { id })
}

function listChannelGroupss(id: number): Promise<Response> {
    return get("channel_group/list_channel_groups", { id })
}

export const channelGroup = {
    show,
    create,
    listChannels,
    listChannelGroupss,
}
