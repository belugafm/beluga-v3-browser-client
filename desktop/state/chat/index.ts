import { PageContextObjectT, StoreProvider } from "./store"

import { AsyncReducerMethodT } from "./store/reducer"
import { swrShowLoggedInUser } from "../../swr/session"
import { websocket } from "./websocket"

const storeProvider = new StoreProvider()

export const useChatStore = (pageContext: PageContextObjectT) => {
    console.info("useChatState")
    let [store] = storeProvider.use(pageContext)
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
        reducer: <T>(method: AsyncReducerMethodT<T>, query: T) =>
            storeProvider.asyncReduce(method, query),
        orderedReducers: <T>(
            reducers: {
                method: AsyncReducerMethodT<T>
                query: T
            }[]
        ) => storeProvider.asyncOrderedReduce(reducers),
    }
}
