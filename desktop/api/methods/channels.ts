import { Response, post, get, UnexpectedResponseError } from "../classes"

function create(body: {
    name: string
    description: string
    public: boolean
    communityId?: string
}): Promise<Response> {
    return post("channels/create", {
        name: body.name,
        description: body.description,
        public: body.public,
        community_id: body.communityId,
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
