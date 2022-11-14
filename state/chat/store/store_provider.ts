import { ReducersT } from "./types/reducer"
import {
    ChannelGroupObjectT,
    ChannelObjectT,
    MessageObjectT,
    UserObjectT,
} from "../../../api/object"
import { ContentType, useAppState } from "./app_state"
import { SetStoreActionsT, StoreT } from "./types/store"

import { ContentStateT, TimelineMode } from "./types/app_state"
import { useDomainData } from "./domain_data"
import { PageContextObjectT } from "./types/page_context"
import { useReducers } from "./reducer"

function getLocalStorageKey(pageContext: PageContextObjectT): string | null {
    if (pageContext.channel) {
        return `content_layout/channel/${pageContext.channel.object.id}`
    }
    if (pageContext.channelGroup) {
        return `content_layout/channel_group/${pageContext.channelGroup.object.id}`
    }
    if (pageContext.thread) {
        return `content_layout/message/${pageContext.thread.object.id}`
    }
    return null
}

const _localStorageCache = {}

function loadContentsFromCache(
    key: string | null,
    pageContext: PageContextObjectT
): ContentStateT[][] {
    if (key == null) {
        return []
    }
    if (key in _localStorageCache) {
        return _localStorageCache[key]
    }
    const content = loadContentsFromLocalStorage(key, pageContext)
    _localStorageCache[key] = content
    return content
}
function isChannelUpToDate(channel: ChannelObjectT, messages: MessageObjectT[]) {
    if (messages.length == 0) {
        return false
    }
    if (channel.last_message_id == null) {
        return true
    }
    const latestMessage = messages[0]
    if (channel.last_message_id == latestMessage.id) {
        return true
    }
    return false
}
function isChanneGrouplUpToDate(channelGroup: ChannelGroupObjectT, messages: MessageObjectT[]) {
    if (messages.length == 0) {
        return false
    }
    if (channelGroup.last_message_id == null) {
        return true
    }
    const latestMessage = messages[0]
    if (channelGroup.last_message_id == latestMessage.id) {
        return true
    }
    return false
}
function isThreadUpToDate(thread: MessageObjectT, messages: MessageObjectT[]) {
    if (messages.length == 0) {
        return false
    }
    const latestMessage = messages[0]
    if (thread.last_reply_message_id == latestMessage.id) {
        return true
    }
    if (thread.last_reply_message_id == null) {
        return true
    }
    return false
}
function loadContentsFromLocalStorage(
    key: string,
    pageContext: PageContextObjectT
): ContentStateT[][] {
    console.info("loadContentsFromLocalStorage::localStorage::getItem")
    const cachedContentsStr = localStorage.getItem(key)
    if (cachedContentsStr) {
        return JSON.parse(cachedContentsStr)
    }
    if (pageContext.channel) {
        return [
            [
                {
                    id: Date.now(),
                    column: 0,
                    row: 0,
                    type: ContentType.Channel,
                    updatedAt: new Date(),
                    postbox: {
                        enabled: true,
                        query: {
                            channelId: pageContext.channel.object.id,
                        },
                    },
                    context: {
                        channelId: pageContext.channel.object.id,
                        channelGroupId: pageContext.channel.parentChannelGroup.id,
                    },
                    options: {
                        showMutedMessage: false,
                    },
                    timeline: {
                        mode: TimelineMode.KeepUpToDate,
                        lastMessageId: pageContext.channel.object.last_message_id,
                        messageIds: pageContext.channel.messages.map((message) => message.id),
                        upToDate: isChannelUpToDate(
                            pageContext.channel.object,
                            pageContext.channel.messages
                        ),
                        query: {
                            channelId: pageContext.channel.object.id,
                        },
                    },
                },
            ],
        ]
    }
    if (pageContext.channelGroup) {
        return [
            [
                {
                    id: Date.now(),
                    column: 0,
                    row: 0,
                    type: ContentType.ChannelGroup,
                    updatedAt: new Date(),
                    postbox: {
                        enabled: false,
                        query: {},
                    },
                    context: {
                        channelGroupId: pageContext.channelGroup.object.id,
                    },
                    options: {
                        showMutedMessage: false,
                    },
                    timeline: {
                        mode: TimelineMode.KeepUpToDate,
                        lastMessageId: pageContext.channelGroup.object.last_message_id,
                        messageIds: pageContext.channelGroup.messages.map((message) => message.id),
                        upToDate: isChanneGrouplUpToDate(
                            pageContext.channelGroup.object,
                            pageContext.channelGroup.messages
                        ),
                        query: {
                            channelId: pageContext.channelGroup.object.id,
                        },
                    },
                },
            ],
        ]
    }
    if (pageContext.thread) {
        return [
            [
                {
                    id: Date.now(),
                    column: 0,
                    row: 0,
                    type: ContentType.Channel,
                    updatedAt: new Date(),
                    postbox: {
                        enabled: true,
                        query: {},
                    },
                    context: {
                        channelGroupId: pageContext.thread.object.id,
                    },
                    options: {
                        showMutedMessage: false,
                    },
                    timeline: {
                        mode: TimelineMode.KeepUpToDate,
                        lastMessageId: pageContext.thread.object.last_reply_message_id,
                        messageIds: pageContext.thread.messages.map((message) => message.id),
                        upToDate: isThreadUpToDate(
                            pageContext.thread.object,
                            pageContext.thread.messages
                        ),
                        query: {
                            channelId: pageContext.thread.object.id,
                        },
                    },
                },
            ],
        ]
    }
    return []
}

function getInitialDomainDataObjects(
    pageContext: PageContextObjectT
): [MessageObjectT[], UserObjectT[], ChannelObjectT[], ChannelGroupObjectT[]] {
    if (pageContext.channel) {
        return [
            pageContext.channel.messages,
            [],
            [pageContext.channel.object].concat(pageContext.initialDomainData.channels),
            [pageContext.channel.parentChannelGroup].concat(
                pageContext.initialDomainData.channelGroups
            ),
        ]
    }
    if (pageContext.channelGroup) {
        return [
            pageContext.channelGroup.messages,
            [],
            pageContext.initialDomainData.channels,
            [pageContext.channelGroup.object].concat(pageContext.initialDomainData.channelGroups),
        ]
    }
    if (pageContext.thread) {
        return [
            [],
            [],
            pageContext.initialDomainData.channels,
            pageContext.initialDomainData.channelGroups,
        ]
    }
    throw Error()
}

function _useDomainData(pageContext: PageContextObjectT) {
    const [messages, users, channels, channelGroups] = getInitialDomainDataObjects(pageContext)
    return useDomainData(messages, users, channels, channelGroups)
}

export class StoreProvider {
    queue: Promise<void> = new Promise((resolve) => resolve())
    use(pageContext: PageContextObjectT): [StoreT, ReducersT] {
        // やっていることはuseStateを隠蔽しているだけ
        const layoutCacheKey = getLocalStorageKey(pageContext)
        const cachedContents = loadContentsFromCache(layoutCacheKey, pageContext)
        const [appState, appStateSetActions] = useAppState(cachedContents)
        const [domainData, domainDataSetActions] = _useDomainData(pageContext)
        const store: StoreT = { domainData, appState }
        const setStoreActions: SetStoreActionsT = {
            domainData: domainDataSetActions,
            appState: appStateSetActions,
        }
        const reducers = useReducers(store, setStoreActions)
        return [store, reducers]
    }
}
