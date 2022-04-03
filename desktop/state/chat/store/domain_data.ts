import {
    ChannelGroupObjectT,
    ChannelObjectT,
    MessageObjectT,
    UserObjectT,
} from "../../../api/object"
import { DomainDataSetActionT, DomainDataT, ObjectMap, UserIdSet } from "./domain_data/types"
import { createContext, useState } from "react"

import { Response } from "../../../api"
import copy from "./domain_data/copy"
import normalize from "./domain_data/normalize"

const context: DomainDataT = {
    messages: null,
    users: null,
    channels: null,
    channelGroups: null,
    mutedUserIds: null,
    blockedUserIds: null,
}

export const ChatDomainDataContext = createContext(context)

export async function fetch<T>(
    prevDomainData: DomainDataT,
    method: (query: T) => Promise<Response>,
    query: T
): Promise<[DomainDataT, Response]> {
    const response = await method(query)
    let nextDomainData: DomainDataT = {
        messages: copy.messages(prevDomainData.messages),
        users: copy.users(prevDomainData.users),
        channels: copy.channels(prevDomainData.channels),
        channelGroups: copy.channelGroups(prevDomainData.channelGroups),
        mutedUserIds: new UserIdSet(prevDomainData.mutedUserIds),
        blockedUserIds: new UserIdSet(prevDomainData.blockedUserIds),
    }
    if (response.message) {
        nextDomainData = normalize.message(copy.message(response.message), nextDomainData)
    }
    if (response.user) {
        nextDomainData = normalize.user(copy.user(response.user), nextDomainData)
    }
    if (response.messages) {
        response.messages.forEach((message) => {
            nextDomainData = normalize.message(copy.message(message), nextDomainData)
        })
    }
    if (response.channel) {
        nextDomainData = normalize.channel(copy.channel(response.channel), nextDomainData)
    }

    return [nextDomainData, response]
}

export function merge(
    prevDomainData: DomainDataT,
    data: {
        channel?: ChannelObjectT
        channels?: ChannelObjectT[]
        channel_group?: ChannelGroupObjectT
        channel_groups?: ChannelGroupObjectT[]
        message?: MessageObjectT
        messages?: MessageObjectT[]
        user?: UserObjectT
        users?: UserObjectT[]
    }
): DomainDataT {
    let nextDomainData: DomainDataT = {
        messages: copy.messages(prevDomainData.messages),
        users: copy.users(prevDomainData.users),
        channels: copy.channels(prevDomainData.channels),
        channelGroups: copy.channelGroups(prevDomainData.channelGroups),
        mutedUserIds: new UserIdSet(prevDomainData.mutedUserIds),
        blockedUserIds: new UserIdSet(prevDomainData.blockedUserIds),
    }
    if (data.message) {
        nextDomainData = normalize.message(copy.message(data.message), nextDomainData)
    }
    if (data.user) {
        nextDomainData = normalize.user(copy.user(data.user), nextDomainData)
    }
    if (data.messages) {
        data.messages.forEach((message) => {
            nextDomainData = normalize.message(copy.message(message), nextDomainData)
        })
    }
    if (data.channel) {
        nextDomainData = normalize.channel(copy.channel(data.channel), nextDomainData)
    }

    return nextDomainData
}

export const useChatDomainData = (): [DomainDataT, DomainDataSetActionT] => {
    console.info("useChatDomainData")
    const [statuses, setStatuses] = useState(new ObjectMap<MessageObjectT>())
    const [users, setUsers] = useState(new ObjectMap<UserObjectT>())
    const [channels, setChannels] = useState(new ObjectMap<ChannelObjectT>())
    const [communities, setCommunities] = useState(new ObjectMap<ChannelGroupObjectT>())
    const [mutedUserIds, setMutedUserIds] = useState(new UserIdSet())
    const [blockedUserIds, setBlockedUserIds] = useState(new UserIdSet())

    return [
        {
            messages: statuses,
            users,
            channels,
            channelGroups: communities,
            mutedUserIds,
            blockedUserIds,
        },
        {
            setMessages: setStatuses,
            setUsers,
            setChannels,
            setCommunities,
            setMutedUserIds,
            setBlockedUserIds,
        },
    ]
}
