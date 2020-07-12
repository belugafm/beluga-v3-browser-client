import { createContext, useState, Dispatch, SetStateAction } from "react"
import { StatusObject, UserObject, ChannelObject, CommunityObject } from "../../api/object"
import { Response } from "../../api"

export type DomainDataT = {
    statusesById: Record<string, StatusObject>
    usersById: Record<string, UserObject>
    channelsById: Record<string, ChannelObject>
    communitiesById: Record<string, CommunityObject>
}

const context: DomainDataT = {
    statusesById: {},
    usersById: {},
    channelsById: {},
    communitiesById: {},
}

export const ChatDomainDataContext = createContext(context)

function normalizeStatus(status: StatusObject | null, nextDomainData: DomainDataT): DomainDataT {
    if (status == null) {
        return nextDomainData
    }
    const user = status.user
    const channel = status.channel
    const community = status.community

    status.user = null
    status.channel = null
    status.community = null

    nextDomainData.statusesById[status.id] = status
    if (user) {
        nextDomainData = normalizeUser(user, nextDomainData)
    }
    if (channel) {
        nextDomainData = normalizeChannel(channel, nextDomainData)
    }
    if (community) {
        nextDomainData = normalizeCommunity(community, nextDomainData)
    }
    return nextDomainData
}

function normalizeUser(user: UserObject | null, nextDomainData: DomainDataT): DomainDataT {
    if (user == null) {
        return nextDomainData
    }
    nextDomainData.usersById[user.id] = user
    return nextDomainData
}

function normalizeChannel(channel: ChannelObject | null, nextDomainData: DomainDataT): DomainDataT {
    if (channel == null) {
        return nextDomainData
    }
    nextDomainData.channelsById[channel.id] = channel
    return nextDomainData
}

function normalizeCommunity(
    community: CommunityObject | null,
    nextDomainData: DomainDataT
): DomainDataT {
    if (community == null) {
        return nextDomainData
    }
    nextDomainData.communitiesById[community.id] = community
    return nextDomainData
}

export async function fetch(
    prevDomainData: DomainDataT,
    method: (query: any) => Promise<Response>,
    query: any
): Promise<[DomainDataT, Response]> {
    const response = await method(query)
    let nextDomainData = {
        statusesById: Object.assign({}, prevDomainData.statusesById),
        usersById: Object.assign({}, prevDomainData.usersById),
        channelsById: Object.assign({}, prevDomainData.channelsById),
        communitiesById: Object.assign({}, prevDomainData.communitiesById),
    }
    if (response.status) {
        nextDomainData = normalizeStatus(response.status, nextDomainData)
    }
    if (response.statuses) {
        response.statuses.forEach((status) => {
            nextDomainData = normalizeStatus(status, nextDomainData)
        })
    }
    if (response.channel) {
        nextDomainData = normalizeChannel(response.channel, nextDomainData)
    }

    return [nextDomainData, response]
}

export type DomainDataSetActionT = {
    setStatusesById: Dispatch<SetStateAction<Record<string, StatusObject>>>
    setUsersById: Dispatch<SetStateAction<Record<string, UserObject>>>
    setChannelsById: Dispatch<SetStateAction<Record<string, ChannelObject>>>
    setCommunitiesById: Dispatch<SetStateAction<Record<string, CommunityObject>>>
}

export const useChatDomainData = (): [DomainDataT, DomainDataSetActionT] => {
    console.info("useChatDomainData")
    const [statusesById, setStatusesById] = useState<Record<string, StatusObject>>({})
    const [usersById, setUsersById] = useState<Record<string, UserObject>>({})
    const [channelsById, setChannelsById] = useState<Record<string, ChannelObject>>({})
    const [communitiesById, setCommunitiesById] = useState<Record<string, CommunityObject>>({})

    return [
        {
            statusesById,
            usersById,
            channelsById,
            communitiesById,
        },
        {
            setStatusesById,
            setUsersById,
            setChannelsById,
            setCommunitiesById,
        },
    ]
}
