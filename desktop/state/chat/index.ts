import { PageContextObjectT, StoreProvider } from "./store"

import { AppStateT } from "./store/types/app_state"
import { AsyncReducersT } from "./store/types/reducer"
import { DomainDataT } from "./store/types/domain_data"
import { swrShowLoggedInUser } from "../../swr/session"
import { websocket } from "./websocket"

const storeProvider = new StoreProvider()

export const useChatStore = (
    pageContext: PageContextObjectT
): {
    domainData: DomainDataT
    appState: AppStateT
    reducers: AsyncReducersT
} => {
    console.info("useChatState")
    let [store, reducers] = storeProvider.use(pageContext)
    const { loggedInUser } = swrShowLoggedInUser()

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
