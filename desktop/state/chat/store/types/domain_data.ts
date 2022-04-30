import {
    ChannelGroupObjectT,
    ChannelObjectT,
    MessageObjectT,
    UserObjectT,
} from "../../../../api/object"
import { Dispatch, SetStateAction } from "react"
import { ObjectMap, UserIdSet } from "../domain_data/data"

export type DomainDataT = {
    messages: ObjectMap<MessageObjectT>
    users: ObjectMap<UserObjectT>
    channels: ObjectMap<ChannelObjectT>
    channelGroups: ObjectMap<ChannelGroupObjectT>
    mutedUserIds: UserIdSet
    blockedUserIds: UserIdSet
}

export type DomainDataSetActionT = {
    setMessages: Dispatch<SetStateAction<ObjectMap<MessageObjectT>>>
    setUsers: Dispatch<SetStateAction<ObjectMap<UserObjectT>>>
    setChannels: Dispatch<SetStateAction<ObjectMap<ChannelObjectT>>>
    setChannelGroups: Dispatch<SetStateAction<ObjectMap<ChannelGroupObjectT>>>
    setMutedUserIds: Dispatch<SetStateAction<UserIdSet>>
    setBlockedUserIds: Dispatch<SetStateAction<UserIdSet>>
}
