import { createContext, useState, Dispatch, SetStateAction } from "react"
import {
    StatusObject,
    UserObject,
    ChannelObject,
    CommunityObject,
} from "../../api/object"
import { Response } from "../../api"

const context: DomainData = {
    statusesById: {},
    usersById: {},
    channelsById: {},
    communitiesById: {},
    setStatusesById: null,
    setUsersById: null,
    setChannelsById: null,
    setCommunitiesById: null,
    reduce: null,
}

export type DomainData = {
    statusesById: Record<string, StatusObject>
    usersById: Record<string, UserObject>
    channelsById: Record<string, ChannelObject>
    communitiesById: Record<string, CommunityObject>
    setStatusesById: Dispatch<SetStateAction<Record<string, StatusObject>>>
    setUsersById: Dispatch<SetStateAction<Record<string, UserObject>>>
    setChannelsById: Dispatch<SetStateAction<Record<string, ChannelObject>>>
    setCommunitiesById: Dispatch<
        SetStateAction<Record<string, CommunityObject>>
    >
    reduce: (
        method: (query: any) => Promise<Response>,
        query: any
    ) => Promise<Response>
}

export const ChatDomainDataContext = createContext(context)

type NextDomainData = {
    statusesById: Record<string, StatusObject>
    usersById: Record<string, UserObject>
    channelsById: Record<string, ChannelObject>
    communitiesById: Record<string, CommunityObject>
}
type NormalizerFunctionReturnType = {
    statusesById: Record<string, StatusObject>
    usersById: Record<string, UserObject>
    channelsById: Record<string, ChannelObject>
    communitiesById: Record<string, CommunityObject>
}
function normalizeStatus(
    status: StatusObject | null,
    nextDomainData: NextDomainData
): NormalizerFunctionReturnType {
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

function normalizeUser(
    user: UserObject | null,
    nextDomainData: NextDomainData
): NormalizerFunctionReturnType {
    if (user == null) {
        return nextDomainData
    }
    nextDomainData.usersById[user.id] = user
    return nextDomainData
}

function normalizeChannel(
    channel: ChannelObject | null,
    nextDomainData: NextDomainData
): NormalizerFunctionReturnType {
    if (channel == null) {
        return nextDomainData
    }
    nextDomainData.channelsById[channel.id] = channel
    return nextDomainData
}

function normalizeCommunity(
    community: CommunityObject | null,
    nextDomainData: NextDomainData
): NormalizerFunctionReturnType {
    if (community == null) {
        return nextDomainData
    }
    nextDomainData.communitiesById[community.id] = community
    return nextDomainData
}

export const useChatDomainData = (): DomainData => {
    console.info("useChatDomainData")
    const [statusesById, setStatusesById] = useState<
        Record<string, StatusObject>
    >({})
    const [usersById, setUsersById] = useState<Record<string, UserObject>>({})
    const [channelsById, setChannelsById] = useState<
        Record<string, ChannelObject>
    >({})
    const [communitiesById, setCommunitiesById] = useState<
        Record<string, CommunityObject>
    >({})

    async function reduce(
        method: (query: any) => Promise<Response>,
        query: any
    ) {
        const response = await method(query)
        const nextStatusesById = Object.assign({}, statusesById)
        const nextUsersById = Object.assign({}, usersById)
        const nextChannelsById = Object.assign({}, channelsById)
        const nextCommunitiesById = Object.assign({}, communitiesById)
        let nextDomainData = {
            statusesById: nextStatusesById,
            usersById: nextUsersById,
            channelsById: nextChannelsById,
            communitiesById: nextCommunitiesById,
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
        setStatusesById(nextDomainData.statusesById)
        setUsersById(nextDomainData.usersById)
        setChannelsById(nextDomainData.channelsById)
        setCommunitiesById(nextDomainData.communitiesById)
        console.info("reduce")
        console.info(nextDomainData)

        return response
    }

    return {
        statusesById,
        usersById,
        channelsById,
        communitiesById,
        setStatusesById,
        setUsersById,
        setChannelsById,
        setCommunitiesById,
        reduce,
    }
}
