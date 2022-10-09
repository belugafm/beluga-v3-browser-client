import { AppStateT } from "./types/app_state"
import { ReducersT } from "./types/reducer"

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
        this.addEventListener("message", (event) => {
            try {
                const data = JSON.parse(event.data)
                console.log("websocket recieved", data)
            } catch (error) {}
        })
    }
}
