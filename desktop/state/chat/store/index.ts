import { StoreProvider } from "./store_provider"

import { AppStateT } from "./types/app_state"
import { ReducersT } from "./types/reducer"
import { DomainDataT } from "./types/domain_data"
import { swrGetLoggedInUser } from "../../../swr/session"
// import { websocket } from "../websocket"
import { PageContextObjectT } from "./types/page_context"
import { Polling } from "./polling"
import { WebSocketClient } from "./websocket"
import config from "../../../config"

const storeProvider = new StoreProvider()
export const polling = new Polling()
export const ws = new WebSocketClient(config.websocket.uri)

export const useStore = (
    pageContext: PageContextObjectT
): {
    domainData: DomainDataT
    appState: AppStateT
    reducers: ReducersT
} => {
    console.debug("useChatState")
    let [store, reducers] = storeProvider.use(pageContext)
    const { loggedInUser } = swrGetLoggedInUser()

    // websocket.use({
    //     loggedInUser,
    //     reducers: {
    //         reducer: storeProvider.asyncReduce,
    //         orderedReducers: storeProvider.asyncOrderedReduce,
    //     },
    //     appState: store.appState,
    // })

    return {
        domainData: store.domainData,
        appState: store.appState,
        reducers: reducers,
        // reducer: <T>(method: AsyncReducerMethodT<T>, query: T) =>
        //     storeProvider.asyncReduce(method, query),
        // orderedReducers: <T>(
        //     reducers: {
        //         method: AsyncReducerMethodT<T>
        //         query: T
        //     }[]
        // ) => storeProvider.asyncOrderedReduce(reducers),
    }
}
