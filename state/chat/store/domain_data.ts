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
import { createContext, useState } from "react"
import { addChannel, addChannelGroup, addMessage, addUser } from "./domain_data/add"

const context: DomainDataT = {
    messages: new ObjectMap<MessageObjectT>(messageCompareFunction),
    users: new ObjectMap<UserObjectT>(userCompareFunction),
    channels: new ObjectMap<ChannelObjectT>(channelCompareFunction),
    channelGroups: new ObjectMap<ChannelGroupObjectT>(immutableCompareFunction),
    mutedUserIds: new UserIdSet(),
    blockedUserIds: new UserIdSet(),
}

export const DomainDataContext = createContext<DomainDataT>(context)

let _initialDomainData: DomainDataT | null = null
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
        domainData = addMessage(message, domainData)
    })
    users.forEach((user) => {
        domainData = addUser(user, domainData)
    })
    channels.forEach((channel) => {
        domainData = addChannel(channel, domainData)
    })
    channelGroups.forEach((channelGroup) => {
        domainData = addChannelGroup(channelGroup, domainData)
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
