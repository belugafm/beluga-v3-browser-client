import { useTheme } from "../../theme"

import { ContentStateT, ContentType } from "../../../../state/chat/store/types/app_state"
import { DomainDataContext } from "../../../../state/chat/store/domain_data"
import { useContext } from "react"
import { ChannelHeaderComponent } from "./headers/Channel"
import { ChannelGroupHeaderComponent } from "./headers/ChannelGroup"
import { ThreadHeaderComponent } from "./headers/Thread"

export const HeaderComponent = ({ content }: { content: ContentStateT }) => {
    const [theme] = useTheme()
    const domainData = useContext(DomainDataContext)
    if (content.type == ContentType.Channel) {
        const channel = domainData.channels.get(content.context.channelId)
        if (channel) {
            return <ChannelHeaderComponent channel={channel} theme={theme} />
        }
    }
    if (content.type == ContentType.ChannelGroup) {
        const channelGroup = domainData.channelGroups.get(content.context.channelGroupId)
        if (channelGroup) {
            return <ChannelGroupHeaderComponent channelGroup={channelGroup} theme={theme} />
        }
    }
    if (content.type == ContentType.Thread) {
        const message = domainData.messages.get(content.context.messageId)
        if (message) {
            return <ThreadHeaderComponent message={message} theme={theme} />
        }
    }
    if (content.type == ContentType.Search) {
    }
    return null
}
