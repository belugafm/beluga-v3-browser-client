import * as reducerMethod from "./reducer_method"

import { AsyncReducerMethodT, AsyncReducersT } from "./store/types/reducer"

import { AppStateT } from "./store/types/app_state"
import { ContentType } from "./store/app_state"
import { Response } from "../../api"
import { UserObjectT } from "../../api/object"
import config from "../../config"

type WebsocketMessage = {
    operation: string
    model: string
    document_id: any
    status?: {
        user_id: string
        channel_id: string
        community_id: string
        thread_status_id: string
    }
}

class WebSocketState {
    uri: string
    ws: WebSocket = null
    reducers: AsyncReducersT
    appState: AppStateT
    loggedInUser: UserObjectT
    eventListeners: {
        type: keyof WebSocketEventMap
        listener: any
    }[] = []
    constructor(uri: string) {
        this.uri = uri
    }
    use({
        reducers,
        appState,
        loggedInUser,
    }: {
        reducers: AsyncReducersT
        appState: AppStateT
        loggedInUser: UserObjectT
    }) {
        this.reducers = reducers
        this.appState = appState
        this.loggedInUser = loggedInUser
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
    reduce = <T>(method: AsyncReducerMethodT<T>, query: T): Promise<Response | null> => {
        return this.reducers.reducer(method, query)
    }
    connect() {
        this.removeAllEventListeners()
        this.ws = new WebSocket(this.uri)
        this.addEventListener("open", (event) => {
            console.debug("open websocket")
        })
        this.addEventListener("close", (event) => {
            console.debug("close websocket", event)
            setTimeout(() => {
                this.connect()
            }, 2000)
        })
        this.addEventListener("error", (event) => {
            console.debug("error websocket", event)
            this.ws.close()
        })
        this.addEventListener("message", (event) => {
            try {
                // const data: WebsocketMessage = JSON.parse(event.data)
                // console.debug("websocket")
                // console.debug(data)
                // if (data.model === "status") {
                //     const status_id = data.document_id
                //     if (data.operation === "delete") {
                //         this.reduce(reducerMethod.messages.mark_as_deleted, {
                //             messageId: status_id,
                //         })
                //     } else if (data.operation === "insert") {
                //         const { status } = data
                //         if (status) {
                //             const { channel_id, community_id, thread_status_id } = status
                //             if (thread_status_id) {
                //                 this.appState.content_grid.forEach((column) => {
                //                     if (column.type !== ContentType.Thread) {
                //                         return
                //                     }
                //                     if (column.context.messageId === thread_status_id) {
                //                         this.reduce(
                //                             reducerMethod.columns.thread.updateTimeline,
                //                             column
                //                         )
                //                     }
                //                 })
                //             }
                //             if (channel_id) {
                //                 this.appState.content_grid.forEach((column) => {
                //                     if (column.type !== ContentType.Channel) {
                //                         return
                //                     }
                //                     if (column.context.channelId === channel_id) {
                //                         this.reduce(
                //                             reducerMethod.columns.channel.updateTimeline,
                //                             column
                //                         )
                //                     }
                //                 })
                //             }
                //         }
                //     } else if (data.operation === "update") {
                //         this.reduce(reducerMethod.messages.show, {
                //             messageId: status_id,
                //         })
                //     }
                // }
                // if (data.model === "user") {
                //     const user_id = data.document_id
                //     this.reduce(reducerMethod.users.show, {
                //         userId: user_id,
                //     })
                // }
            } catch (error) {}
        })
    }
}

export const websocket = new WebSocketState(config.websocket.uri)
