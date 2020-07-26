import { createContext, useState, Dispatch, SetStateAction } from "react"
import { StatusObjectT, UserObjectT, ChannelObjectT, CommunityObjectT } from "../../../api/object"
import { Response } from "../../../api"

function getUpdateTime(a: any): number {
    const { updated_at, last_activity_time } = a
    if (updated_at) {
        return updated_at
    }
    if (last_activity_time) {
        return last_activity_time
    }
    return -1
}

class ObjectMap<T> {
    data: Map<string, T> = new Map()
    lastModified: number = Date.now()
    updatedKeys: Set<string> = new Set()
    get(key: string): T | null {
        return this.data[key]
    }
    set(key: string, value: T) {
        this.data[key] = value
    }
    update(key: string, value: T) {
        this.data[key] = value
        this.updatedKeys.add(key)
    }
    equals(target: ObjectMap<T>): boolean {
        if (this.updatedKeys.size === 0) {
            return true
        }
        try {
            this.updatedKeys.forEach((key) => {
                const a = this.data[key]
                const b = target.data[key]
                if (b == null) {
                    throw new Error()
                }
                if (getUpdateTime(a) !== getUpdateTime(b)) {
                    throw new Error()
                }
            })
        } catch (error) {
            return false
        }
        return true
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
    statuses: ObjectMap<StatusObjectT>
    users: ObjectMap<UserObjectT>
    channels: ObjectMap<ChannelObjectT>
    communities: ObjectMap<CommunityObjectT>
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

    status.entities.channels.forEach((entity) => {
        if (entity.channel == null) {
            return
        }
        nextDomainData = normalize_channel(entity.channel, nextDomainData)
        entity.channel = null
    })

    status.entities.statuses.forEach((entity) => {
        if (entity.status == null) {
            return
        }
        nextDomainData = normalize_status(entity.status, nextDomainData)
        entity.status = null
    })

    nextDomainData.statuses.update(status.id, status)

    return nextDomainData
}

function normalize_user(user: UserObjectT | null, nextDomainData: DomainDataT): DomainDataT {
    if (user == null) {
        return nextDomainData
    }
    nextDomainData.users.update(user.id, user)

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
    nextDomainData.channels.update(channel.id, channel)
    return nextDomainData
}

function normalize_community(
    community: CommunityObjectT | null,
    nextDomainData: DomainDataT
): DomainDataT {
    if (community == null) {
        return nextDomainData
    }
    nextDomainData.communities.update(community.id, community)
    return nextDomainData
}

function copy_status(status: StatusObjectT | null): StatusObjectT {
    if (status === null) {
        return null
    }
    return {
        id: status.id,
        user_id: status.user_id,
        user: copy_user(status.user),
        channel_id: status.channel_id,
        channel: copy_channel(status.channel),
        community_id: status.community_id,
        community: copy_community(status.community),
        text: status.text,
        created_at: status.created_at,
        updated_at: status.updated_at,
        public: status.public,
        edited: status.edited,
        deleted: status.deleted ? status.deleted : false,
        favorited: status.favorited,
        entities: status.entities,
        comment_count: status.comment_count,
        likes: {
            count: status.likes.count,
            counts: status.likes.counts.concat(),
        },
        favorites: {
            count: status.favorites.count,
            users: status.favorites.users.map((user) => copy_user(user)),
            user_ids: status.favorites.user_ids
                ? status.favorites.user_ids.concat()
                : status.favorites.users.map((user) => user.id),
        },
    }
}

export function copy_statuses(statuses: ObjectMap<StatusObjectT>) {
    const ret = new ObjectMap<StatusObjectT>()
    Object.keys(statuses.data).forEach((status_id) => {
        const status = statuses.get(status_id)
        ret.set(status_id, copy_status(status))
    })
    ret.lastModified = statuses.lastModified
    return ret
}

function copy_user(user: UserObjectT | null): UserObjectT {
    if (user === null) {
        return null
    }
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
        last_activity_time: user.last_activity_time,
    }
}

export function copy_users(users: ObjectMap<UserObjectT>) {
    const ret = new ObjectMap<UserObjectT>()
    Object.keys(users.data).forEach((user_id) => {
        const user = users.get(user_id)
        ret.set(user_id, copy_user(user))
    })
    ret.lastModified = users.lastModified
    return ret
}

function copy_channel(channel: ChannelObjectT | null): ChannelObjectT {
    if (channel === null) {
        return null
    }
    return {
        id: channel.id,
        name: channel.name,
        description: channel.description,
        stats: {
            statuses_count: channel.stats.statuses_count,
        },
        created_at: channel.created_at,
        updated_at: channel.updated_at,
        creator_id: channel.creator_id,
        creator: copy_user(channel.creator),
        public: channel.public,
        community_id: channel.community_id,
        community: copy_community(channel.community),
    }
}

export function copy_channels(channels: ObjectMap<ChannelObjectT>) {
    const ret = new ObjectMap<ChannelObjectT>()
    Object.keys(channels.data).forEach((channel_id) => {
        const channel = channels.get(channel_id)
        ret.set(channel_id, copy_channel(channel))
    })
    ret.lastModified = channels.lastModified
    return ret
}

function copy_community(community: CommunityObjectT | null): CommunityObjectT {
    if (community === null) {
        return null
    }
    return {
        id: community.id,
        name: community.name,
        description: community.description,
        stats: {
            statuses_count: community.stats.statuses_count,
            channels_count: community.stats.channels_count,
        },
        created_at: community.created_at,
        updated_at: community.updated_at,
        creator_id: community.creator_id,
        creator: copy_user(community.creator),
    }
}

export function copy_communities(communities: ObjectMap<CommunityObjectT>) {
    const ret = new ObjectMap<CommunityObjectT>()
    Object.keys(communities.data).forEach((community_id) => {
        const community = communities.get(community_id)
        ret.set(community_id, copy_community(community))
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
        nextDomainData = normalize_status(copy_status(response.status), nextDomainData)
    }
    if (response.user) {
        nextDomainData = normalize_user(copy_user(response.user), nextDomainData)
    }
    if (response.statuses) {
        response.statuses.forEach((status) => {
            nextDomainData = normalize_status(copy_status(status), nextDomainData)
        })
    }
    if (response.channel) {
        nextDomainData = normalize_channel(copy_channel(response.channel), nextDomainData)
    }

    return [nextDomainData, response]
}

export type DomainDataSetActionT = {
    setStatuses: Dispatch<SetStateAction<ObjectMap<StatusObjectT>>>
    setUsers: Dispatch<SetStateAction<ObjectMap<UserObjectT>>>
    setChannels: Dispatch<SetStateAction<ObjectMap<ChannelObjectT>>>
    setCommunities: Dispatch<SetStateAction<ObjectMap<CommunityObjectT>>>
    setMutedUserIds: Dispatch<SetStateAction<StringSet>>
    setBlockedUserIds: Dispatch<SetStateAction<StringSet>>
}

export const useChatDomainData = (): [DomainDataT, DomainDataSetActionT] => {
    console.info("useChatDomainData")
    const [statuses, setStatuses] = useState(new ObjectMap<StatusObjectT>())
    const [users, setUsers] = useState(new ObjectMap<UserObjectT>())
    const [channels, setChannels] = useState(new ObjectMap<ChannelObjectT>())
    const [communities, setCommunities] = useState(new ObjectMap<CommunityObjectT>())
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
