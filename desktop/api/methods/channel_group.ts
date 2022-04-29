import { Response, UnexpectedResponseError, get, post } from "../fetch"

function buildPayload(query: { id?: number; uniqueName?: string }) {
    if (query.id) {
        return { id: query.id }
    }
    if (query.uniqueName) {
        return { unique_name: query.uniqueName }
    }
    return {}
}

export const channelGroup = {
    show: async (query: { id?: number; uniqueName?: string }): Promise<Response> => {
        if (query.id == null && query.uniqueName == null) {
            throw new UnexpectedResponseError()
        }
        const responce = await get("channel_group/show", buildPayload(query))
        if (responce.channel_group == null) {
            throw new UnexpectedResponseError()
        }
        return responce
    },
    create: (body: { name: string; parentId: number }): Promise<Response> => {
        return post("channel_group/create", {
            name: body.name,
            parent_id: body.parentId,
        })
    },
    listChannels: (query: { id: number }): Promise<Response> => {
        return get("channel_group/list_channels", query)
    },
    listChannelGroupss: (query: { id: number }): Promise<Response> => {
        return get("channel_group/list_channel_groups", query)
    },
}
