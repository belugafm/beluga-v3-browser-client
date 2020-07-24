import { ReducersT } from "./reducer"
import * as reducer_methods from "./reducer_methods"
import { UserObjectT } from "../../api/object"
import config from "../../config"

type EventListener = (this: WebSocket, ev: WebSocketEventMap[K]) => any

class WebSocketState {
    uri: string
    ws: WebSocket = null
    reducers: ReducersT
    loggedInUser: UserObjectT
    eventListeners: {
        type: keyof WebSocketEventMap
        listener: EventListener
    }[] = []
    constructor(uri: string) {
        this.uri = uri
    }
    use(loggedInUser: UserObjectT, reducers: ReducersT) {
        this.reducers = reducers
        this.loggedInUser = loggedInUser
        if (this.ws === null) {
            this.connect()
        }
    }
    addEventListener<K extends keyof WebSocketEventMap>(type: K, listener: EventListener) {
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
            console.info("open websocket")
        })
        this.addEventListener("close", (event) => {
            console.info("close websocket")
            setTimeout(() => {
                this.connect()
            }, 2000)
        })
        this.addEventListener("error", (event) => {
            console.info("error websocket")
            this.ws.close()
        })
        this.addEventListener("message", (event) => {
            try {
                const data: WebsocketMessage = JSON.parse(event.data)
                console.info("websocket")
                console.info(data)
                if (data.model === "status") {
                    const status_id = data.document_id
                    if (data.operation === "delete") {
                        this.reducers.reducer(reducer_methods.statuses.mark_as_deleted, {
                            status_id,
                        })
                    } else if (data.operation === "insert") {
                        const { status } = data
                        if (status) {
                            if (status.user_id !== this.loggedInUser.id) {
                                const { channel_id, community_id } = status
                                if (channel_id) {
                                    this.reducers.reducer(
                                        reducer_methods.columns.channel.updateTimeline,
                                        {
                                            channelId: channel_id,
                                        }
                                    )
                                }
                            }
                        }
                    } else if (data.operation === "update") {
                        this.reducers.reducer(reducer_methods.statuses.show, {
                            status_id,
                        })
                    }
                }
            } catch (error) {}
        })
    }
}

export const websocket = new WebSocketState(config.websocket.uri)