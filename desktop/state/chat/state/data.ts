import { createContext, useState, Dispatch, SetStateAction } from "react"
import { StatusObjectT, UserObjectT, ChannelObjectT, CommunityObjectT } from "../../../api/object"
import { Response } from "../../../api"
import equals from "deep-equal"

class Map<T> {
    data: Record<string, T> = {}
    lastModified: number = Date.now()
    get(key: string): T | null {
        return this.data[key]
    }
    set(key: string, value: T) {
        this.data[key] = value
    }
    equals(target: Map<T>) {
        return equals(this.data, target.data)
    }
}

export type DomainDataT = {
    statuses: Map<StatusObjectT>
    users: Map<UserObjectT>
    channels: Map<ChannelObjectT>
    communities: Map<CommunityObjectT>
}

const context: DomainDataT = {
    statuses: null,
    users: null,
    channels: null,
    communities: null,
}

export const ChatDomainDataContext = createContext(context)

function normalize_status(status: StatusObjectT | null, nextDomainData: DomainDataT): DomainDataT {
    if (status == null) {
        return nextDomainData
    }

    if (status.user) {
        nextDomainData = normalize_user(status.user, nextDomainData)
        status.user = null
    }

    if (status.channel) {
        nextDomainData = normalize_channel(status.channel, nextDomainData)
        status.channel = null
    }

    if (status.community) {
        nextDomainData = normalize_community(status.community, nextDomainData)
        status.community = null
    }

    status.likes.counts.forEach((item) => {
        nextDomainData = normalize_user(item.user, nextDomainData)
    })
    status.likes = {
        count: status.likes.count,
        counts: status.likes.counts.map((item) => {
            return {
                count: item.count,
                user_id: item.user.id,
                user: null,
            }
        }),
    }

    status.favorites.user_ids = []
    status.favorites.users.forEach((user) => {
        nextDomainData = normalize_user(user, nextDomainData)
        status.favorites.user_ids.push(user.id)
    })
    status.favorites.users = []

    nextDomainData.statuses.set(status.id, status)

    return nextDomainData
}

function normalize_user(user: UserObjectT | null, nextDomainData: DomainDataT): DomainDataT {
    if (user == null) {
        return nextDomainData
    }
    nextDomainData.users.set(user.id, user)
    return nextDomainData
}

function normalize_channel(
    channel: ChannelObjectT | null,
    nextDomainData: DomainDataT
): DomainDataT {
    if (channel == null) {
        return nextDomainData
    }
    nextDomainData.channels.set(channel.id, channel)
    return nextDomainData
}

function normalize_community(
    community: CommunityObjectT | null,
    nextDomainData: DomainDataT
): DomainDataT {
    if (community == null) {
        return nextDomainData
    }
    nextDomainData.communities.set(community.id, community)
    return nextDomainData
}

export function copy_statuses(statuses: Map<StatusObjectT>) {
    const ret = new Map<StatusObjectT>()
    Object.keys(statuses.data).forEach((status_id) => {
        const status = statuses.get(status_id)
        ret.set(status_id, {
            id: status.id,
            user_id: status.user_id,
            user: null,
            channel_id: status.channel_id,
            channel: null,
            community_id: status.community_id,
            community: null,
            text: status.text,
            created_at: status.created_at,
            public: status.public,
            edited: status.edited,
            deleted: status.deleted,
            likes: {
                count: status.likes.count,
                counts: status.likes.counts.concat(),
            },
            favorites: {
                count: status.favorites.count,
                users: [],
                user_ids: status.favorites.user_ids.concat(),
            },
        })
    })
    ret.lastModified = statuses.lastModified
    return ret
}

export function copy_users(users: Map<UserObjectT>) {
    const ret = new Map<UserObjectT>()
    Object.keys(users.data).forEach((user_id) => {
        const user = users.get(user_id)
        ret.set(user_id, {
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
            active: user.active,
            dormant: user.dormant,
            muted: user.muted,
            blocked: user.blocked,
            last_activity_date: user.last_activity_date,
        })
    })
    ret.lastModified = users.lastModified
    return ret
}

export function copy_channels(channels: Map<ChannelObjectT>) {
    const ret = new Map<ChannelObjectT>()
    Object.keys(channels.data).forEach((channel_id) => {
        const channel = channels.get(channel_id)
        ret.set(channel_id, {
            id: channel.id,
            name: channel.name,
            description: channel.description,
            stats: {
                statuses_count: channel.stats.statuses_count,
            },
            created_at: channel.created_at,
            creator_id: channel.creator_id,
            creator: null,
            public: channel.public,
            community_id: channel.community_id,
            community: null,
        })
    })
    ret.lastModified = channels.lastModified
    return ret
}

export function copy_communities(communities: Map<CommunityObjectT>) {
    const ret = new Map<CommunityObjectT>()
    Object.keys(communities.data).forEach((community_id) => {
        const community = communities.get(community_id)
        ret.set(community_id, {
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
        })
    })
    ret.lastModified = communities.lastModified
    return ret
}

export async function fetch(
    prevDomainData: DomainDataT,
    method: (query: any) => Promise<Response>,
    query: any
): Promise<[DomainDataT, Response]> {
    const response = await method(query)
    let nextDomainData = {
        statuses: copy_statuses(prevDomainData.statuses),
        users: copy_users(prevDomainData.users),
        channels: copy_channels(prevDomainData.channels),
        communities: copy_communities(prevDomainData.communities),
    }
    if (response.status) {
        nextDomainData = normalize_status(response.status, nextDomainData)
    }
    if (response.user) {
        nextDomainData = normalize_user(response.user, nextDomainData)
    }
    if (response.statuses) {
        response.statuses.forEach((status) => {
            nextDomainData = normalize_status(status, nextDomainData)
        })
    }
    if (response.channel) {
        nextDomainData = normalize_channel(response.channel, nextDomainData)
    }

    return [nextDomainData, response]
}

export type DomainDataSetActionT = {
    setStatuses: Dispatch<SetStateAction<Map<StatusObjectT>>>
    setUsers: Dispatch<SetStateAction<Map<UserObjectT>>>
    setChannels: Dispatch<SetStateAction<Map<ChannelObjectT>>>
    setCommunities: Dispatch<SetStateAction<Map<CommunityObjectT>>>
}

export const useChatDomainData = (): [DomainDataT, DomainDataSetActionT] => {
    console.info("useChatDomainData")
    const [statuses, setStatuses] = useState(new Map<StatusObjectT>())
    const [users, setUsers] = useState(new Map<UserObjectT>())
    const [channels, setChannels] = useState(new Map<ChannelObjectT>())
    const [communities, setCommunities] = useState(new Map<CommunityObjectT>())

    return [
        {
            statuses,
            users,
            channels,
            communities,
        },
        {
            setStatuses,
            setUsers,
            setChannels,
            setCommunities,
        },
    ]
}
