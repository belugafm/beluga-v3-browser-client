import { useState } from "react"
import {
    StatusObject,
    UserObject,
    ChannelObject,
    CommunityObject,
} from "../../api/object"

export const useChatDomainData = () => {
    const [statusesById, setStatusesById] = useState<{
        [key: string]: StatusObject
    }>({})
    const [usersById, setUsersById] = useState<{ [key: string]: UserObject }>(
        {}
    )
    const [channelsById, setChannelsById] = useState<{
        [key: string]: ChannelObject
    }>({})
    const [communitiesById, setCommunitiesById] = useState<{
        [key: string]: CommunityObject
    }>({})
}
