import {
    ChannelGroupObjectT,
    ChannelObjectT,
    ChannelReadStateObjectT,
    FileObjectT,
    MessageEntityFileNode,
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

function copyMessageEntityFiles(nodes: MessageEntityFileNode[]) {
    if (nodes.length == 0) {
        return []
    }
    return nodes.map((node) => {
        return {
            file_id: node.file_id,
            file: copyFile(node.file),
            indices: [...node.indices],
        } as MessageEntityFileNode
    })
}

function copyMessageEntities(
    sourceEntities: MessageObjectT["entities"]
): MessageObjectT["entities"] {
    const entities: MessageObjectT["entities"] = {
        channel_groups: [],
        channels: [],
        messages: [],
        files: copyMessageEntityFiles(sourceEntities.files),
        favorited_users: [],
        favorited_user_ids: [],
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
    sourceEntities.favorited_users.forEach((sourceEntity) => {
        entities.favorited_users.push(copyUser(sourceEntity))
    })
    if (sourceEntities.favorited_user_ids) {
        sourceEntities.favorited_user_ids.forEach((userId) => {
            entities.favorited_user_ids.push(userId)
        })
    }
    return entities
}

export function copyMessage(message: MessageObjectT | null): MessageObjectT | null {
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
        _internal_updated_at: message._internal_updated_at,
        deleted: message.deleted ? message.deleted : false,
        entities: copyMessageEntities(message.entities),
        reply_count: message.reply_count,
        like_count: message.like_count,
        favorite_count: message.favorite_count,
        favorited: message.favorited,
        thread_id: message.thread_id,
        last_reply_message_id: message.last_reply_message_id,
        last_reply_message_created_at: message.last_reply_message_created_at,
    }
}

export function copyMessages(prevMessages: ObjectMap<MessageObjectT>) {
    const nextMessages = new ObjectMap<MessageObjectT>(messageCompareFunction)
    prevMessages.data.forEach((message, messageId) => {
        // @ts-ignore
        nextMessages.set(messageId, copyMessage(message))
    })
    return nextMessages
}

export function copyUser(user: UserObjectT | null): UserObjectT | null {
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

export function copyUsers(prevUsers: ObjectMap<UserObjectT>) {
    const nextUsers = new ObjectMap<UserObjectT>(userCompareFunction)
    prevUsers.data.forEach((user, userId) => {
        // @ts-ignore
        nextUsers.set(userId, copyUser(user))
    })
    return nextUsers
}

export function copyChannel(channel: ChannelObjectT | null): ChannelObjectT | null {
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
        minimum_trust_rank: channel.minimum_trust_rank,
        parent_channel_group: copyChannelGroup(channel.parent_channel_group),
    }
}

export function copyChannels(prevChannels: ObjectMap<ChannelObjectT>) {
    const nextChannels = new ObjectMap<ChannelObjectT>(channelCompareFunction)
    prevChannels.data.forEach((channel, channelId) => {
        // @ts-ignore
        nextChannels.set(channelId, copyChannel(channel))
    })
    return nextChannels
}

export function copyChannelGroup(
    channelGroup: ChannelGroupObjectT | null
): ChannelGroupObjectT | null {
    if (channelGroup == null) {
        return null
    }
    return {
        id: channelGroup.id,
        unique_name: channelGroup.unique_name,
        description: channelGroup.description,
        image_url: channelGroup.image_url,
        name: channelGroup.name,
        level: channelGroup.level,
        channels_count: channelGroup.channels_count,
        message_count: channelGroup.message_count,
        created_at: channelGroup.created_at,
        created_by: channelGroup.created_by,
        creator: copyUser(channelGroup.creator),
        last_message_id: channelGroup.last_message_id,
        last_message_created_at: channelGroup.last_message_created_at,
        minimum_trust_rank: channelGroup.minimum_trust_rank,
        parent_id: channelGroup.parent_id,
        parent: copyChannelGroup(channelGroup.parent),
    }
}

export function copyChannelGroups(prevChannelGroups: ObjectMap<ChannelGroupObjectT>) {
    const nextChannelGroups = new ObjectMap<ChannelGroupObjectT>(immutableCompareFunction)
    prevChannelGroups.data.forEach((channelGroup, channelGroupId) => {
        // @ts-ignore
        nextChannelGroups.set(channelGroupId, copyChannelGroup(channelGroup))
    })
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

export function copyFile(file: FileObjectT | null): FileObjectT | null {
    if (file == null) {
        return null
    }
    return {
        id: file.id,
        user_id: file.user_id,
        group: file.group,
        url: file.url,
        type: file.type,
        bytes: file.bytes,
        original: file.original,
        ref_count: file.ref_count,
        created_at: file.created_at,
        width: file.width,
        height: file.height,
        tag: file.tag,
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
