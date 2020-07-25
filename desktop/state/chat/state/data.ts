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

export class StringSet extends Set<string> {
    equals(target: StringSet) {
        let ok = true
        this.forEach((id) => {
            if (target.has(id) === false) {
                ok = false
            }
        })
        target.forEach((id) => {
            if (this.has(id) === false) {
                ok = false
            }
        })
        return ok
    }
}

export type DomainDataT = {
    statuses: Map<StatusObjectT>
    users: Map<UserObjectT>
    channels: Map<ChannelObjectT>
    communities: Map<CommunityObjectT>
    mutedUserIds: StringSet
    blockedUserIds: StringSet
}

const context: DomainDataT = {
    statuses: null,
    users: null,
    channels: null,
    communities: null,
    mutedUserIds: null,
    blockedUserIds: null,
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

    nextDomainData.statuses.set(status.id, copy_status(status))

    return nextDomainData
}

function normalize_user(user: UserObjectT | null, nextDomainData: DomainDataT): DomainDataT {
    if (user == null) {
        return nextDomainData
    }
    nextDomainData.users.set(user.id, copy_user(user))

    if (user.muted) {
        nextDomainData.mutedUserIds.add(user.id)
    } else {
        nextDomainData.mutedUserIds.delete(user.id)
    }

    if (user.blocked) {
        nextDomainData.blockedUserIds.add(user.id)
    } else {
        nextDomainData.blockedUserIds.delete(user.id)
    }

    return nextDomainData
}

function normalize_channel(
    channel: ChannelObjectT | null,
    nextDomainData: DomainDataT
): DomainDataT {
    if (channel == null) {
        return nextDomainData
    }
    nextDomainData.channels.set(channel.id, copy_channel(channel))
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

function copy_status(status: StatusObjectT) {
    return {
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
    }
}

export function copy_statuses(statuses: Map<StatusObjectT>) {
    const ret = new Map<StatusObjectT>()
    Object.keys(statuses.data).forEach((status_id) => {
        const status = statuses.get(status_id)
        ret.set(status_id, copy_status(status))
    })
    ret.lastModified = statuses.lastModified
    return ret
}

function copy_user(user: UserObjectT) {
    return {
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
    }
}

export function copy_users(users: Map<UserObjectT>) {
    const ret = new Map<UserObjectT>()
    Object.keys(users.data).forEach((user_id) => {
        const user = users.get(user_id)
        ret.set(user_id, copy_user(user))
    })
    ret.lastModified = users.lastModified
    return ret
}

function copy_channel(channel: ChannelObjectT) {
    return {
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
    }
}

export function copy_channels(channels: Map<ChannelObjectT>) {
    const ret = new Map<ChannelObjectT>()
    Object.keys(channels.data).forEach((channel_id) => {
        const channel = channels.get(channel_id)
        ret.set(channel_id, copy_channel(channel))
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

export async function fetch<T>(
    prevDomainData: DomainDataT,
    method: (query: T) => Promise<Response>,
    query: T
): Promise<[DomainDataT, Response]> {
    const response = await method(query)
    let nextDomainData: DomainDataT = {
        statuses: copy_statuses(prevDomainData.statuses),
        users: copy_users(prevDomainData.users),
        channels: copy_channels(prevDomainData.channels),
        communities: copy_communities(prevDomainData.communities),
        mutedUserIds: new StringSet(prevDomainData.mutedUserIds),
        blockedUserIds: new StringSet(prevDomainData.blockedUserIds),
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
    setMutedUserIds: Dispatch<SetStateAction<StringSet>>
    setBlockedUserIds: Dispatch<SetStateAction<StringSet>>
}

export const useChatDomainData = (): [DomainDataT, DomainDataSetActionT] => {
    console.info("useChatDomainData")
    const [statuses, setStatuses] = useState(new Map<StatusObjectT>())
    const [users, setUsers] = useState(new Map<UserObjectT>())
    const [channels, setChannels] = useState(new Map<ChannelObjectT>())
    const [communities, setCommunities] = useState(new Map<CommunityObjectT>())
    const [mutedUserIds, setMutedUserIds] = useState(new StringSet())
    const [blockedUserIds, setBlockedUserIds] = useState(new StringSet())

    return [
        {
            statuses,
            users,
            channels,
            communities,
            mutedUserIds,
            blockedUserIds,
        },
        {
            setStatuses,
            setUsers,
            setChannels,
            setCommunities,
            setMutedUserIds,
            setBlockedUserIds,
        },
    ]
}
