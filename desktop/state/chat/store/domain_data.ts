import {
    ChannelGroupObjectT,
    ChannelObjectT,
    MessageObjectT,
    UserObjectT,
} from "../../../api/object"
import { DomainDataSetActionT, DomainDataT } from "./types/domain_data"
import {
    ObjectMap,
    UserIdSet,
    channelCompareFunction,
    immutableCompareFunction,
    messageCompareFunction,
    userCompareFunction,
} from "./domain_data/data"
import copy, { copyDomainData } from "./domain_data/copy"
import { createContext, useState } from "react"
import normalize, {
    normalizeChannel,
    normalizeChannelGroup,
    normalizeMessage,
    normalizeUser,
} from "./domain_data/normalize"

import { Response } from "../../../api"

const context: DomainDataT = {
    messages: null,
    users: null,
    channels: null,
    channelGroups: null,
    mutedUserIds: null,
    blockedUserIds: null,
}

export const DomainDataContext = createContext(context)

export async function fetch<T>(
    prevDomainData: DomainDataT,
    method: (query: T) => Promise<Response>,
    query: T
): Promise<[DomainDataT, Response]> {
    const response = await method(query)
    let nextDomainData = copyDomainData(prevDomainData)
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
    if (response.channels) {
        response.channels.forEach((channel) => {
            nextDomainData = normalize.channel(copy.channel(channel), nextDomainData)
        })
    }

    return [nextDomainData, response]
}

let _initialDomainData = null
function buildInitialDomainData(
    messages: MessageObjectT[],
    users: UserObjectT[],
    channels: ChannelObjectT[],
    channelGroups: ChannelGroupObjectT[]
): DomainDataT {
    if (_initialDomainData) {
        return _initialDomainData
    }
    let domainData: DomainDataT = {
        messages: new ObjectMap<MessageObjectT>(messageCompareFunction),
        users: new ObjectMap<UserObjectT>(userCompareFunction),
        channels: new ObjectMap<ChannelObjectT>(channelCompareFunction),
        channelGroups: new ObjectMap<ChannelGroupObjectT>(immutableCompareFunction),
        mutedUserIds: new UserIdSet(),
        blockedUserIds: new UserIdSet(),
    }
    messages.forEach((message) => {
        domainData = normalizeMessage(message, domainData)
    })
    users.forEach((user) => {
        domainData = normalizeUser(user, domainData)
    })
    channels.forEach((channel) => {
        domainData = normalizeChannel(channel, domainData)
    })
    channelGroups.forEach((channelGroup) => {
        domainData = normalizeChannelGroup(channelGroup, domainData)
    })
    _initialDomainData = domainData
    return domainData
}

export const useDomainData = (
    initialMessages: MessageObjectT[],
    initialUsers: UserObjectT[],
    initialChannels: ChannelObjectT[],
    initialChannelGroups: ChannelGroupObjectT[]
): [DomainDataT, DomainDataSetActionT] => {
    const initialDomainData = buildInitialDomainData(
        initialMessages,
        initialUsers,
        initialChannels,
        initialChannelGroups
    )
    const [messages, setMessages] = useState(initialDomainData.messages)
    const [users, setUsers] = useState(initialDomainData.users)
    const [channels, setChannels] = useState(initialDomainData.channels)
    const [channelGroups, setChannelGroups] = useState(initialDomainData.channelGroups)
    const [mutedUserIds, setMutedUserIds] = useState(new UserIdSet())
    const [blockedUserIds, setBlockedUserIds] = useState(new UserIdSet())

    return [
        {
            messages,
            users,
            channels,
            channelGroups,
            mutedUserIds,
            blockedUserIds,
        },
        {
            setMessages,
            setUsers,
            setChannels,
            setChannelGroups,
            setMutedUserIds,
            setBlockedUserIds,
        },
    ]
}
