import {
    ChannelGroupObjectT,
    ChannelObjectT,
    MessageObjectT,
    UserObjectT,
} from "../../../../api/object"
import { DomainDataT, ObjectMap, UserIdSet } from "../types/domain_data"

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

function copyMessages(prevMessages: ObjectMap<MessageObjectT>) {
    const nextMessages = new ObjectMap<MessageObjectT>()
    prevMessages.data.forEach((message, messageId) => {
        // @ts-ignore
        nextMessages.set(messageId, copyMessage(message))
    })
    nextMessages.lastModified = prevMessages.lastModified
    return nextMessages
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
        description: user.description,
        favorited_count: user.favorited_count,
        favorites_count: user.favorites_count,
        message_count: user.message_count,
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

function copyUsers(prevUsers: ObjectMap<UserObjectT>) {
    const nextUsers = new ObjectMap<UserObjectT>()
    prevUsers.data.forEach((user, userId) => {
        // @ts-ignore
        nextUsers.set(userId, copyUser(user))
    })
    nextUsers.lastModified = prevUsers.lastModified
    return nextUsers
}

function copyChannel(channel: ChannelObjectT | null): ChannelObjectT {
    if (channel == null) {
        return null
    }
    return {
        id: channel.id,
        unique_name: channel.unique_name,
        status_string: channel.status_string,
        description: channel.description,
        message_count: channel.message_count,
        name: channel.name,
        created_at: channel.created_at,
        created_by: channel.created_by,
        creator: copyUser(channel.creator),
        parent_channel_group_id: channel.parent_channel_group_id,
        parent_channel_group: copyChannelGroup(channel.parent_channel_group),
    }
}

function copyChannels(prevChannels: ObjectMap<ChannelObjectT>) {
    const nextChannels = new ObjectMap<ChannelObjectT>()
    prevChannels.data.forEach((channel, channelId) => {
        // @ts-ignore
        nextChannels.set(channelId, copyChannel(channel))
    })
    nextChannels.lastModified = prevChannels.lastModified
    return nextChannels
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

function copyChannelGroups(prevChannelGroups: ObjectMap<ChannelGroupObjectT>) {
    const nextChannelGroups = new ObjectMap<ChannelGroupObjectT>()
    prevChannelGroups.data.forEach((channelGroup, channelGroupId) => {
        // @ts-ignore
        nextChannelGroups.set(channelGroupId, copyChannelGroup(channelGroup))
    })
    nextChannelGroups.lastModified = prevChannelGroups.lastModified
    return nextChannelGroups
}

export function copyDomainData(prevDomainData: DomainDataT): DomainDataT {
    return {
        messages: copyMessages(prevDomainData.messages),
        users: copyUsers(prevDomainData.users),
        channels: copyChannels(prevDomainData.channels),
        channelGroups: copyChannelGroups(prevDomainData.channelGroups),
        mutedUserIds: new UserIdSet(prevDomainData.mutedUserIds),
        blockedUserIds: new UserIdSet(prevDomainData.blockedUserIds),
    }
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
