import {
    ChannelGroupObjectT,
    ChannelObjectT,
    MessageObjectT,
    UserObjectT,
} from "../../../../api/object"

import { DomainDataT } from "../types/domain_data"
import { messageUpdated } from "./check_update"

export function addMessage(
    message: MessageObjectT | null,
    nextDomainData: DomainDataT
): DomainDataT {
    if (message == null) {
        return nextDomainData
    }

    if (message.user) {
        nextDomainData = addUser(message.user, nextDomainData)
        message.user = null
    }

    if (message.channel) {
        nextDomainData = addChannel(message.channel, nextDomainData)
        message.channel = null
    }

    message.entities.channels.forEach((entity) => {
        if (entity.channel == null) {
            return
        }
        nextDomainData = addChannel(entity.channel, nextDomainData)
        entity.channel = null
    })

    message.entities.messages.forEach((entity) => {
        if (entity.message == null) {
            return
        }
        nextDomainData = addMessage(entity.message, nextDomainData)
        entity.message = null
    })

    message.entities.favorited_user_ids = []
    message.entities.favorited_users.forEach((user) => {
        nextDomainData = addUser(user, nextDomainData)
        message.entities.favorited_user_ids.push(user.id)
    })
    message.entities.favorited_users = []

    message.created_at = new Date(message.created_at)
    if (messageUpdated(message, nextDomainData)) {
        message._internal_updated_at = Date.now()
    }
    nextDomainData.messages.update(message.id, message)

    return nextDomainData
}

export function addUser(user: UserObjectT | null, nextDomainData: DomainDataT): DomainDataT {
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

export function addChannel(
    channel: ChannelObjectT | null,
    nextDomainData: DomainDataT
): DomainDataT {
    if (channel == null) {
        return nextDomainData
    }
    if (channel.last_message) {
        // last_messageは不完全なのでnormalizeMessageはしない
        channel.last_message.created_at = new Date(channel.last_message.created_at)
    }
    if (channel.read_state && channel.read_state.last_message) {
        // last_messageは不完全なのでnormalizeMessageはしない
        channel.read_state.last_message.created_at = new Date(
            channel.read_state.last_message.created_at
        )
    }
    nextDomainData.channels.update(channel.id, channel)
    return nextDomainData
}

export function addChannelGroup(
    community: ChannelGroupObjectT | null,
    nextDomainData: DomainDataT
): DomainDataT {
    if (community == null) {
        return nextDomainData
    }
    nextDomainData.channelGroups.update(community.id, community)
    return nextDomainData
}

export default {
    message: addMessage,
    channel: addChannel,
    user: addUser,
    channelGroup: addChannelGroup,
}
