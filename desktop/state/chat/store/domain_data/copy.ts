import {
    ChannelGroupObjectT,
    ChannelObjectT,
    MessageObjectT,
    UserObjectT,
} from "../../../../api/object"

import { ObjectMap } from "./types"

function copyMessage(message: MessageObjectT | null): MessageObjectT {
    if (message == null) {
        return null
    }
    return {
        id: message.id,
        user_id: message.user_id,
        user: copyUser(message.user),
        channel_id: message.channel_id,
        channel: copyChannel(message.channel),
        text: message.text,
        created_at: message.created_at,
        updated_at: message.updated_at,
        public: message.public,
        edited: message.edited,
        deleted: message.deleted ? message.deleted : false,
        favorited: message.favorited,
        entities: message.entities,
        reply_count: message.reply_count,
        like_count: message.like_count,
        favorite: {
            count: 0,
            users: [],
            user_ids: [],
        },
    }
}

function copyMessages(messages: ObjectMap<MessageObjectT>) {
    const ret = new ObjectMap<MessageObjectT>()
    Object.keys(messages.data).forEach((messageId) => {
        // @ts-ignore
        const message = messages.get(messageId)
        // @ts-ignore
        ret.set(messageId, copyMessage(message))
    })
    ret.lastModified = messages.lastModified
    return ret
}

function copyUser(user: UserObjectT | null): UserObjectT {
    if (user == null) {
        return null
    }
    return {
        id: user.id,
        twitter_user_id: user.twitter_user_id,
        name: user.name,
        display_name: user.display_name,
        profile_image_url: user.profile_image_url,
        location: user.location,
        url: user.url,
        theme_color: user.theme_color,
        background_image_url: user.background_image_url,
        description: user.description,
        favorited_count: user.favorited_count,
        favorites_count: user.favorites_count,
        statuses_count: user.statuses_count,
        liked_count: user.liked_count,
        likes_count: user.likes_count,
        default_profile: user.default_profile,
        bot: user.bot,
        suspended: user.suspended,
        trust_level: user.trust_level,
        created_at: user.created_at,
        active: user.active,
        dormant: user.dormant,
        muted: user.muted,
        blocked: user.blocked,
        last_activity_date: user.last_activity_date,
    }
}

function copyUsers(users: ObjectMap<UserObjectT>) {
    const ret = new ObjectMap<UserObjectT>()
    Object.keys(users.data).forEach((userId) => {
        // @ts-ignore
        const user = users.get(userId)
        // @ts-ignore
        ret.set(userId, copyUser(user))
    })
    ret.lastModified = users.lastModified
    return ret
}

function copyChannel(channel: ChannelObjectT | null): ChannelObjectT {
    if (channel == null) {
        return null
    }
    return {
        id: channel.id,
        unique_name: channel.unique_name,
        status_string: channel.status_string,
        channels_count: channel.channels_count,
        statuses_count: channel.statuses_count,
        name: channel.name,
        created_at: channel.created_at,
        created_by: channel.created_by,
        creator: copyUser(channel.creator),
        parent_channel_group_id: channel.parent_channel_group_id,
        parent_channel_group: copyChannelGroup(channel.parent_channel_group),
    }
}

function copyChannels(channels: ObjectMap<ChannelObjectT>) {
    const ret = new ObjectMap<ChannelObjectT>()
    Object.keys(channels.data).forEach((channelId) => {
        // @ts-ignore
        const channel = channels.get(channelId)
        // @ts-ignore
        ret.set(channelId, copyChannel(channel))
    })
    ret.lastModified = channels.lastModified
    return ret
}

function copyChannelGroup(channelGroup: ChannelGroupObjectT | null): ChannelGroupObjectT {
    if (channelGroup == null) {
        return null
    }
    return {
        id: channelGroup.id,
        unique_name: channelGroup.unique_name,
        name: channelGroup.name,
        level: channelGroup.level,
        channels_count: channelGroup.channels_count,
        statuses_count: channelGroup.statuses_count,
        created_at: channelGroup.created_at,
        created_by: channelGroup.created_by,
        creator: copyUser(channelGroup.creator),
    }
}

function copyChannelGroups(channelGroups: ObjectMap<ChannelGroupObjectT>) {
    const ret = new ObjectMap<ChannelGroupObjectT>()
    Object.keys(channelGroups.data).forEach((channel_group_id) => {
        // @ts-ignore
        const community = channelGroups.get(channel_group_id)
        // @ts-ignore
        ret.set(channel_group_id, copyChannelGroup(community))
    })
    ret.lastModified = channelGroups.lastModified
    return ret
}

export default {
    message: copyMessage,
    channel: copyChannel,
    user: copyUser,
    channelGroup: copyChannelGroup,
    messages: copyMessages,
    channels: copyChannels,
    users: copyUsers,
    channelGroups: copyChannelGroups,
}
