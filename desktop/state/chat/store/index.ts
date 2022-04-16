import { AsyncReducerMethodT, AsyncReducersT } from "./types/reducer"
import {
    ChannelGroupObjectT,
    ChannelObjectT,
    MessageObjectT,
    UserObjectT,
} from "../../../api/object"
import { ContentType, useAppState } from "./app_state"
import { StoreSetActionsT, StoreT } from "./types/store"

import { ContentStateT } from "./types/app_state"
import { Response } from "../../../api"
import { udpateStore } from "./update"
import { useDomainData } from "./domain_data"

export type PageContextObjectT = {
    channel?: {
        object: ChannelObjectT
        messages: MessageObjectT[]
    }
    channelGroup?: {
        object: ChannelGroupObjectT
        messages: MessageObjectT[]
    }
    thread?: {
        object: MessageObjectT
        messages: MessageObjectT[]
    }
}

function getLocalStorageKey(pageContext: PageContextObjectT): string {
    if (pageContext.channel) {
        return `content_layout/channel/${pageContext.channel.object.id}`
    }
    if (pageContext.channelGroup) {
        return `content_layout/channel_group/${pageContext.channelGroup.object.id}`
    }
    if (pageContext.thread) {
        return `content_layout/message/${pageContext.thread.object.id}`
    }
    throw Error()
}

const _localStorageCache = {}

function loadContentsFromCache(key: string, pageContext: PageContextObjectT): ContentStateT[][] {
    if (key in _localStorageCache) {
        return _localStorageCache[key]
    }
    const content = loadContentsFromLocalStorage(key, pageContext)
    _localStorageCache[key] = content
    return content
}

function loadContentsFromLocalStorage(
    key: string,
    pageContext: PageContextObjectT
): ContentStateT[][] {
    console.log("loadContentsFromLocalStorage::localStorage::getItem")
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
                    postbox: {
                        enabled: true,
                        query: {
                            channelId: pageContext.channel.object.id,
                        },
                    },
                    context: {
                        channelId: pageContext.channel.object.id,
                    },
                    options: {
                        showMutedMessage: false,
                    },
                    timeline: {
                        messageIds: pageContext.channel.messages.map((message) => message.id),
                        isLoadingLatestMessagesEnabled: true,
                        query: {
                            channelId: pageContext.channel.object.id,
                        },
                    },
                },
            ],
        ]
        return [
            [
                {
                    id: Date.now(),
                    column: 0,
                    row: 0,
                    type: ContentType.Channel,
                    postbox: {
                        enabled: true,
                        query: {
                            channelId: pageContext.channel.object.id,
                        },
                    },
                    context: {
                        channelId: pageContext.channel.object.id,
                    },
                    options: {
                        showMutedMessage: false,
                    },
                    timeline: {
                        messageIds: pageContext.channel.messages.map((message) => message.id),
                        isLoadingLatestMessagesEnabled: true,
                        query: {
                            channelId: pageContext.channel.object.id,
                        },
                    },
                },
                {
                    id: Date.now(),
                    column: 0,
                    row: 1,
                    type: ContentType.Channel,
                    postbox: {
                        enabled: true,
                        query: {
                            channelId: pageContext.channel.object.id,
                        },
                    },
                    context: {
                        channelId: pageContext.channel.object.id,
                    },
                    options: {
                        showMutedMessage: false,
                    },
                    timeline: {
                        messageIds: pageContext.channel.messages.map((message) => message.id),
                        isLoadingLatestMessagesEnabled: true,
                        query: {
                            channelId: pageContext.channel.object.id,
                        },
                    },
                },
                {
                    id: Date.now(),
                    column: 0,
                    row: 3,
                    type: ContentType.Channel,
                    postbox: {
                        enabled: true,
                        query: {
                            channelId: pageContext.channel.object.id,
                        },
                    },
                    context: {
                        channelId: pageContext.channel.object.id,
                    },
                    options: {
                        showMutedMessage: false,
                    },
                    timeline: {
                        messageIds: pageContext.channel.messages.map((message) => message.id),
                        isLoadingLatestMessagesEnabled: true,
                        query: {
                            channelId: pageContext.channel.object.id,
                        },
                    },
                },
            ],
            [
                {
                    id: Date.now(),
                    column: 1,
                    row: 0,
                    type: ContentType.Channel,
                    postbox: {
                        enabled: true,
                        query: {
                            channelId: pageContext.channel.object.id,
                        },
                    },
                    context: {
                        channelId: pageContext.channel.object.id,
                    },
                    options: {
                        showMutedMessage: false,
                    },
                    timeline: {
                        messageIds: pageContext.channel.messages.map((message) => message.id),
                        isLoadingLatestMessagesEnabled: true,
                        query: {
                            channelId: pageContext.channel.object.id,
                        },
                    },
                },
            ],
            [
                {
                    id: Date.now(),
                    column: 1,
                    row: 0,
                    type: ContentType.Channel,
                    postbox: {
                        enabled: true,
                        query: {},
                    },
                    context: {
                        channelId: pageContext.channel.object.id,
                    },
                    options: {
                        showMutedMessage: false,
                    },
                    timeline: {
                        messageIds: pageContext.channel.messages.map((message) => message.id),
                        isLoadingLatestMessagesEnabled: true,
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
                    type: ContentType.Channel,
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
                        messageIds: pageContext.channelGroup.messages.map((message) => message.id),
                        isLoadingLatestMessagesEnabled: true,
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
                        messageIds: pageContext.thread.messages.map((message) => message.id),
                        isLoadingLatestMessagesEnabled: true,
                        query: {
                            channelId: pageContext.thread.object.id,
                        },
                    },
                },
            ],
        ]
    }
    throw new Error()
}

function getInitialDomainDataObjects(
    pageContext: PageContextObjectT
): [MessageObjectT[], UserObjectT[], ChannelObjectT[], ChannelGroupObjectT[]] {
    if (pageContext.channel) {
        return [pageContext.channel.messages, [], [pageContext.channel.object], []]
    }
    if (pageContext.channelGroup) {
        return [pageContext.channelGroup.messages, [], [], [pageContext.channelGroup.object]]
    }
    if (pageContext.thread) {
        return [pageContext.channelGroup.messages.concat([pageContext.thread.object]), [], [], []]
    }
    throw Error()
}

function _useDomainData(pageContext: PageContextObjectT) {
    const [messages, users, channels, channelGroups] = getInitialDomainDataObjects(pageContext)
    return useDomainData(messages, users, channels, channelGroups)
}

export class StoreProvider {
    queue: Promise<void> = new Promise((resolve) => resolve())
    use(pageContext: PageContextObjectT): [StoreT, AsyncReducersT] {
        const layoutCacheKey = getLocalStorageKey(pageContext)
        const cachedContents = loadContentsFromCache(layoutCacheKey, pageContext)
        const [appState, appStateSetActions] = useAppState(cachedContents)
        const [domainData, domainDataSetActions] = _useDomainData(pageContext)
        const store: StoreT = { domainData, appState }
        const storeSetActions: StoreSetActionsT = {
            domainData: domainDataSetActions,
            appState: appStateSetActions,
        }

        const reducer = <T>(method: AsyncReducerMethodT<T>, query: T): Promise<Response | null> => {
            return new Promise((resolve) => {
                this.queue = this.queue.then(async () => {
                    try {
                        const [nextStore, response] = await method(store, query)
                        udpateStore(storeSetActions, store, nextStore)
                        resolve(response)
                    } catch (error) {
                        console.error(error)
                        alert(error)
                    }
                    resolve(null)
                })
            })
        }
        const sequentialReducer = async <T>(
            reducers: {
                method: AsyncReducerMethodT<T>
                query: T
            }[]
        ): Promise<void> => {
            this.queue = this.queue.then(async () => {
                try {
                    let currentStore = store
                    for (let index = 0; index < reducers.length; index++) {
                        const { method, query } = reducers[index]
                        const [nextStore] = await method(currentStore, query)
                        currentStore = udpateStore(storeSetActions, currentStore, nextStore)
                    }
                } catch (error) {
                    console.error(error)
                    alert(error)
                }
            })
        }
        const reducers = { reducer, sequentialReducer }
        return [store, reducers]
    }
}
