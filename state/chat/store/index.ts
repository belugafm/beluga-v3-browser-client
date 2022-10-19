import { StoreProvider } from "./store_provider"
import { AppStateT } from "./types/app_state"
import { ReducersT } from "./types/reducer"
import { DomainDataT } from "./types/domain_data"
import { PageContextObjectT } from "./types/page_context"
import { Polling } from "./polling"
import { WebSocketClient } from "./websocket"
import config from "../../../config"

const storeProvider = new StoreProvider()
export const polling = new Polling()
export const websocket = new WebSocketClient(config.websocket.uri)

export const useStore = (
    pageContext: PageContextObjectT
): {
    domainData: DomainDataT
    appState: AppStateT
    reducers: ReducersT
} => {
    console.debug("useChatState")
    let [store, reducers] = storeProvider.use(pageContext)

    return {
        domainData: store.domainData,
        appState: store.appState,
        reducers: reducers,
    }
}
