import { MessageSearchQueryT } from "../../../../api/methods/messages"
import {
    ChannelGroupObjectT,
    ChannelId,
    ChannelObjectT,
    MessageObjectT,
} from "../../../../api/object"

export type PageContextObjectT = {
    channel?: {
        object: ChannelObjectT
        messages: MessageObjectT[]
        parentChannelGroup: ChannelGroupObjectT
    }
    channelGroup?: {
        object: ChannelGroupObjectT
        messages: MessageObjectT[]
    }
    thread?: {
        object: MessageObjectT
        messages: MessageObjectT[]
        parentChannelGroup: ChannelGroupObjectT
    }
    search?: {
        messages: MessageObjectT[]
        query: MessageSearchQueryT
    }
    initialDomainData: {
        channels: ChannelObjectT[]
        channelGroups: ChannelGroupObjectT[]
    }
}
