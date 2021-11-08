import { ChannelObjectT, CommunityObjectT, StatusObjectT, UserObjectT } from "../../../api/object"
import { DomainDataSetActionT, DomainDataT, ObjectMap, StringSet } from "./data/types"
import { createContext, useState } from "react"

import { Response } from "../../../api"
import copy from "./data/copy"
import normalize from "./data/normalize"

const context: DomainDataT = {
    statuses: null,
    users: null,
    channels: null,
    communities: null,
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
        statuses: copy.statuses(prevDomainData.statuses),
        users: copy.users(prevDomainData.users),
        channels: copy.channels(prevDomainData.channels),
        communities: copy.communities(prevDomainData.communities),
        mutedUserIds: new StringSet(prevDomainData.mutedUserIds),
        blockedUserIds: new StringSet(prevDomainData.blockedUserIds),
    }
    if (response.status) {
        nextDomainData = normalize.status(copy.status(response.status), nextDomainData)
    }
    if (response.user) {
        nextDomainData = normalize.user(copy.user(response.user), nextDomainData)
    }
    if (response.statuses) {
        response.statuses.forEach((status) => {
            nextDomainData = normalize.status(copy.status(status), nextDomainData)
        })
    }
    if (response.channel) {
        nextDomainData = normalize.channel(copy.channel(response.channel), nextDomainData)
    }

    return [nextDomainData, response]
}

export const useChatDomainData = (): [DomainDataT, DomainDataSetActionT] => {
    console.info("useChatDomainData")
    const [statuses, setStatuses] = useState(new ObjectMap<StatusObjectT>())
    const [users, setUsers] = useState(new ObjectMap<UserObjectT>())
    const [channels, setChannels] = useState(new ObjectMap<ChannelObjectT>())
    const [communities, setCommunities] = useState(new ObjectMap<CommunityObjectT>())
    const [mutedUserIds, setMutedUserIds] = useState(new StringSet())
    const [blockedUserIds, setBlockedUserIds] = useState(new StringSet())

    return [
        {
            statuses,
            users,
            channels,
            communities,
            mutedUserIds,
            blockedUserIds,
        },
        {
            setStatuses,
            setUsers,
            setChannels,
            setCommunities,
            setMutedUserIds,
            setBlockedUserIds,
        },
    ]
}
