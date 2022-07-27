import { ChannelGroupObjectT, ChannelObjectT, MessageObjectT } from "../../../../api/object"

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
    initialDomainData: {
        channels: ChannelObjectT[]
        channelGroups: ChannelGroupObjectT[]
    }
}
