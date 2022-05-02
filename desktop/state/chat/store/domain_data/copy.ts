import {
    ChannelGroupObjectT,
    ChannelObjectT,
    ChannelReadStateObjectT,
    MessageEntityStyleNode,
    MessageObjectT,
    UserObjectT,
} from "../../../../api/object"
import {
    ObjectMap,
    UserIdSet,
    channelCompareFunction,
    immutableCompareFunction,
    messageCompareFunction,
    userCompareFunction,
} from "../domain_data/data"

import { DomainDataT } from "../types/domain_data"

function copyCHannelReadState(state: ChannelReadStateObjectT | null): ChannelReadStateObjectT {
    if (state == null) {
        return null
    }
    return {
        id: state.id,
        user_id: state.user_id,
        channel_id: state.channel_id,
        last_message_id: state.last_message_id,
        last_message_created_at: state.last_message_created_at,
        last_message: copyMessage(state.last_message),
    }
}

function copyMessageEntityStyles(nodes: MessageEntityStyleNode[]) {
    if (nodes.length == 0) {
        return []
    }
    return nodes.map((node) => {
        return {
            children: copyMessageEntityStyles(node.children),
            type: node.type,
            style: node.style
                ? {
                      format: node.style.format,
                      color: node.style.color,
                  }
                : null,
            indices: [...node.indices],
            text: node.text,
        } as MessageEntityStyleNode
    })
}

function copyMessageEntities(
    sourceEntities: MessageObjectT["entities"]
): MessageObjectT["entities"] {
    const entities: MessageObjectT["entities"] = {
        channel_groups: [],
        channels: [],
        messages: [],
        style: copyMessageEntityStyles(sourceEntities.style),
    }
    sourceEntities.channel_groups.forEach((sourceEntity) => {
        entities.channel_groups.push({
            channel_group_id: sourceEntity.channel_group_id,
            channel_group: copyChannelGroup(sourceEntity.channel_group),
            indices: [...sourceEntity.indices],
        })
    })
    sourceEntities.channels.forEach((sourceEntity) => {
        entities.channels.push({
            channel_id: sourceEntity.channel_id,
            channel: copyChannel(sourceEntity.channel),
            indices: [...sourceEntity.indices],
        })
    })
    sourceEntities.messages.forEach((sourceEntity) => {
        entities.messages.push({
            message_id: sourceEntity.message_id,
            message: copyMessage(sourceEntity.message),
            indices: [...sourceEntity.indices],
        })
    })
    return entities
}

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
        deleted: message.deleted ? message.deleted : false,
        entities: copyMessageEntities(message.entities),
        reply_count: message.reply_count,
        like_count: message.like_count,
        favorite_count: message.favorite_count,
        thread_id: message.thread_id,
    }
}

function copyMessages(prevMessages: ObjectMap<MessageObjectT>) {
    const nextMessages = new ObjectMap<MessageObjectT>(messageCompareFunction)
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
    const nextUsers = new ObjectMap<UserObjectT>(userCompareFunction)
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
        last_message_id: channel.last_message_id,
        last_message_created_at: channel.last_message_created_at,
        last_message: copyMessage(channel.last_message),
        read_state: copyCHannelReadState(channel.read_state),
        parent_channel_group_id: channel.parent_channel_group_id,
        parent_channel_group: copyChannelGroup(channel.parent_channel_group),
    }
}

function copyChannels(prevChannels: ObjectMap<ChannelObjectT>) {
    const nextChannels = new ObjectMap<ChannelObjectT>(channelCompareFunction)
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
    const nextChannelGroups = new ObjectMap<ChannelGroupObjectT>(immutableCompareFunction)
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
