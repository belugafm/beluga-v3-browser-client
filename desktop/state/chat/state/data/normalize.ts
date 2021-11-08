import {
    ChannelObjectT,
    CommunityObjectT,
    StatusObjectT,
    UserObjectT,
} from "../../../../api/object"

import { DomainDataT } from "./types"

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

export default {
    status: normalize_status,
    channel: normalize_channel,
    user: normalize_user,
    community: normalize_community,
}
