import { createContext, useState, Dispatch, SetStateAction } from "react"
import { StatusObjectT, UserObjectT, ChannelObjectT, CommunityObjectT } from "../../api/object"
import { Response } from "../../api"
import { channel } from "../../api/methods/timeline/channel"

export type DomainDataT = {
    statusesById: Record<string, StatusObjectT>
    usersById: Record<string, UserObjectT>
    channelsById: Record<string, ChannelObjectT>
    communitiesById: Record<string, CommunityObjectT>
}

const context: DomainDataT = {
    statusesById: {},
    usersById: {},
    channelsById: {},
    communitiesById: {},
}

export const ChatDomainDataContext = createContext(context)

function normalizeStatus(status: StatusObjectT | null, nextDomainData: DomainDataT): DomainDataT {
    if (status == null) {
        return nextDomainData
    }

    if (status.user) {
        nextDomainData = normalizeUser(status.user, nextDomainData)
        status.user = null
    }

    if (status.channel) {
        nextDomainData = normalizeChannel(status.channel, nextDomainData)
        status.channel = null
    }

    if (status.community) {
        nextDomainData = normalizeCommunity(status.community, nextDomainData)
        status.community = null
    }

    status.likes.user_ids = []
    status.likes.users.forEach((user) => {
        nextDomainData = normalizeUser(user, nextDomainData)
        status.likes.user_ids.push(user.id)
    })
    status.likes.users = []

    status.favorites.user_ids = []
    status.favorites.users.forEach((user) => {
        nextDomainData = normalizeUser(user, nextDomainData)
        status.favorites.user_ids.push(user.id)
    })
    status.favorites.users = []

    nextDomainData.statusesById[status.id] = status

    return nextDomainData
}

function normalizeUser(user: UserObjectT | null, nextDomainData: DomainDataT): DomainDataT {
    if (user == null) {
        return nextDomainData
    }
    nextDomainData.usersById[user.id] = user
    return nextDomainData
}

function normalizeChannel(
    channel: ChannelObjectT | null,
    nextDomainData: DomainDataT
): DomainDataT {
    if (channel == null) {
        return nextDomainData
    }
    nextDomainData.channelsById[channel.id] = channel
    return nextDomainData
}

function normalizeCommunity(
    community: CommunityObjectT | null,
    nextDomainData: DomainDataT
): DomainDataT {
    if (community == null) {
        return nextDomainData
    }
    nextDomainData.communitiesById[community.id] = community
    return nextDomainData
}

function copy_statuses(statuses: Record<string, StatusObjectT>) {
    const ret: Record<string, StatusObjectT> = {}
    Object.keys(statuses).forEach((status_id) => {
        const status = statuses[status_id]
        ret[status_id] = {
            id: status.id,
            user_id: status.user_id,
            user: null,
            channel_id: status.channel_id,
            channel: null,
            community_id: status.community_id,
            community: null,
            text: status.text,
            created_at: status.created_at,
            is_public: status.is_public,
            is_edited: status.is_edited,
            is_deleted: status.is_deleted,
            likes: {
                count: status.likes.count,
                users: [],
                user_ids: status.likes.user_ids.concat(),
            },
            favorites: {
                count: status.favorites.count,
                users: [],
                user_ids: status.favorites.user_ids.concat(),
            },
        }
    })
    return ret
}

function copy_users(users: Record<string, UserObjectT>) {
    const ret: Record<string, UserObjectT> = {}
    Object.keys(users).forEach((user_id) => {
        const user = users[user_id]
        ret[user_id] = {
            id: user.id,
            name: user.name,
            display_name: user.display_name,
            profile: {
                avatar_image_url: user.profile.avatar_image_url,
                location: user.profile.location,
                description: user.profile.description,
                theme_color: user.profile.theme_color,
                background_image_url: user.profile.background_image_url,
            },
            stats: {
                statuses_count: user.stats.statuses_count,
            },
            created_at: user.created_at,
            is_active: user.is_active,
            is_dormant: user.is_dormant,
            last_activity_date: user.last_activity_date,
        }
    })
    return ret
}

function copy_channels(channels: Record<string, ChannelObjectT>) {
    const ret: Record<string, ChannelObjectT> = {}
    Object.keys(channels).forEach((channel_id) => {
        const channel = channels[channel_id]
        ret[channel_id] = {
            id: channel.id,
            name: channel.name,
            description: channel.description,
            stats: {
                statuses_count: channel.stats.statuses_count,
            },
            created_at: channel.created_at,
            creator_id: channel.creator_id,
            creator: null,
            is_public: channel.is_public,
            community_id: channel.community_id,
            community: null,
        }
    })
    return ret
}

function copy_communities(communities: Record<string, CommunityObjectT>) {
    const ret: Record<string, CommunityObjectT> = {}
    Object.keys(communities).forEach((community_id) => {
        const community = communities[community_id]
        ret[community_id] = {
            id: community.id,
            name: community.name,
            description: community.description,
            stats: {
                statuses_count: community.stats.statuses_count,
                channels_count: community.stats.channels_count,
            },
            created_at: community.created_at,
            creator_id: community.creator_id,
            creator: null,
        }
    })
    return ret
}

export async function fetch(
    prevDomainData: DomainDataT,
    method: (query: any) => Promise<Response>,
    query: any
): Promise<[DomainDataT, Response]> {
    const response = await method(query)
    let nextDomainData = {
        statusesById: copy_statuses(prevDomainData.statusesById),
        usersById: copy_users(prevDomainData.usersById),
        channelsById: copy_channels(prevDomainData.channelsById),
        communitiesById: copy_communities(prevDomainData.communitiesById),
    }
    if (response.status) {
        nextDomainData = normalizeStatus(response.status, nextDomainData)
    }
    if (response.statuses) {
        response.statuses.forEach((status) => {
            nextDomainData = normalizeStatus(status, nextDomainData)
        })
    }
    if (response.channel) {
        nextDomainData = normalizeChannel(response.channel, nextDomainData)
    }

    return [nextDomainData, response]
}

export type DomainDataSetActionT = {
    setStatusesById: Dispatch<SetStateAction<Record<string, StatusObjectT>>>
    setUsersById: Dispatch<SetStateAction<Record<string, UserObjectT>>>
    setChannelsById: Dispatch<SetStateAction<Record<string, ChannelObjectT>>>
    setCommunitiesById: Dispatch<SetStateAction<Record<string, CommunityObjectT>>>
}

export const useChatDomainData = (): [DomainDataT, DomainDataSetActionT] => {
    console.info("useChatDomainData")
    const [statusesById, setStatusesById] = useState<Record<string, StatusObjectT>>({})
    const [usersById, setUsersById] = useState<Record<string, UserObjectT>>({})
    const [channelsById, setChannelsById] = useState<Record<string, ChannelObjectT>>({})
    const [communitiesById, setCommunitiesById] = useState<Record<string, CommunityObjectT>>({})

    return [
        {
            statusesById,
            usersById,
            channelsById,
            communitiesById,
        },
        {
            setStatusesById,
            setUsersById,
            setChannelsById,
            setCommunitiesById,
        },
    ]
}
