import { AppStateT, TimelineMode } from "./types/app_state"
import { ReducersT } from "./types/reducer"
import { show as updateUser } from "./reducer_method/domain_data/user"
import { showMessage as updateMessage } from "./reducer_method/domain_data/message"
import { show as updateChannel } from "./reducer_method/domain_data/channel"
import { show as updateChannelGroup } from "./reducer_method/domain_data/channel_group"
import { loadLatestMessages as loadChannelLatestMessages } from "./reducer_method/app_state/channel"
import { loadLatestMessages as loadChannelGroupLatestMessages } from "./reducer_method/app_state/channel_group"
import { setUpdatedAtToAllContents } from "./reducer_method/app_state/content"

export class WebSocketClient {
    reducers: ReducersT
    appState: AppStateT
    ws: WebSocket = null
    uri: string
    eventListeners: {
        type: keyof WebSocketEventMap
        listener: any
    }[] = []
    constructor(uri: string) {
        this.uri = uri
    }
    use({ reducers, appState }: { reducers: ReducersT; appState: AppStateT }) {
        this.reducers = reducers
        this.appState = appState
        if (this.ws === null) {
            this.connect()
        }
    }
    addEventListener<K extends keyof WebSocketEventMap>(
        type: K,
        listener: (this: WebSocket, ev: WebSocketEventMap[K]) => any
    ) {
        this.eventListeners.push({ type, listener })
        this.ws.addEventListener(type, listener)
    }
    removeAllEventListeners() {
        this.eventListeners.forEach(({ type, listener }) => {
            this.ws.removeEventListener(type, listener)
        })
        this.eventListeners = []
    }
    connect() {
        this.removeAllEventListeners()
        this.ws = new WebSocket(this.uri)
        this.addEventListener("open", (event) => {
            console.log("open websocket")
        })
        this.addEventListener("close", (event) => {
            console.log("close websocket", event)
            setTimeout(() => {
                this.connect()
            }, 2000)
        })
        this.addEventListener("error", (event) => {
            console.log("error websocket", event)
            this.ws.close()
        })
        this.addEventListener("message", async (event) => {
            try {
                const data = JSON.parse(event.data)
                console.log("websocket recieved", data)
                if (data.user_id) {
                    return this.reducers.asyncReducer(updateUser, {
                        id: data.user_id,
                    })
                }
                if (data.message_id) {
                    await this.reducers.asyncReducer(updateMessage, {
                        id: data.message_id,
                    })
                    // 各タイムラインを強制再描画し現在のデータを反映
                    this.reducers.reducer(setUpdatedAtToAllContents, new Date())
                    return
                }
                if (data.channel_id) {
                    this.reducers.asyncReducer(updateChannel, {
                        id: data.channel_id,
                    })
                    for (const rows of this.appState.contents) {
                        for (const content of rows) {
                            if (content.timeline.mode != TimelineMode.KeepUpToDate) {
                                continue
                            }
                            if (content.context.channelId) {
                                this.reducers.asyncReducer(loadChannelLatestMessages, content)
                            }
                        }
                    }
                    return
                }
                if (data.channel_group_id) {
                    this.reducers.asyncReducer(updateChannelGroup, {
                        id: data.channel_id,
                    })
                    for (const rows of this.appState.contents) {
                        for (const content of rows) {
                            if (content.timeline.mode != TimelineMode.KeepUpToDate) {
                                continue
                            }
                            if (content.context.channelGroupId) {
                                this.reducers.asyncReducer(loadChannelGroupLatestMessages, content)
                            }
                        }
                    }
                    return
                }
            } catch (error) {}
        })
    }
}
