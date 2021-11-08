import {
    ChannelObjectT,
    CommunityObjectT,
    StatusObjectT,
    UserObjectT,
} from "../../../../api/object"

import { ObjectMap } from "./types"

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

function copy_statuses(statuses: ObjectMap<StatusObjectT>) {
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

function copy_users(users: ObjectMap<UserObjectT>) {
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

function copy_channels(channels: ObjectMap<ChannelObjectT>) {
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

function copy_communities(communities: ObjectMap<CommunityObjectT>) {
    const ret = new ObjectMap<CommunityObjectT>()
    Object.keys(communities.data).forEach((community_id) => {
        const community = communities.get(community_id)
        ret.set(community_id, copy_community(community))
    })
    ret.lastModified = communities.lastModified
    return ret
}

export default {
    status: copy_status,
    channel: copy_channel,
    user: copy_user,
    community: copy_community,
    statuses: copy_statuses,
    channels: copy_channels,
    users: copy_users,
    communities: copy_communities,
}
