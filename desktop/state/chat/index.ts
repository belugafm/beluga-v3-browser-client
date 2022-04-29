import * as reducerMethod from "./reducer_method"

import { PageContextObjectT, StoreProvider } from "./store"

import { AppStateT } from "./store/types/app_state"
import { AsyncReducersT } from "./store/types/reducer"
import { DomainDataT } from "./store/types/domain_data"
import { swrShowLoggedInUser } from "../../swr/session"
import { websocket } from "./websocket"

const storeProvider = new StoreProvider()

class Polling {
    reducers: AsyncReducersT
    appState: AppStateT
    timerIds: number[] = []
    use({ reducers, appState }: { reducers: AsyncReducersT; appState: AppStateT }) {
        this.reducers = reducers
        this.appState = appState
        this.clearTimers()
        this.setTimers()
    }
    clearTimers() {
        for (const timerId of this.timerIds) {
            clearInterval(timerId)
        }
        this.timerIds = []
    }
    setTimers() {
        const parentChannelGroupIdSet = new Set<number>()
        for (const rows of this.appState.contents) {
            for (const content of rows) {
                if (content.context.channelGroupId) {
                    parentChannelGroupIdSet.add(content.context.channelGroupId)
                }
                if (content.timeline.isLoadingLatestMessagesEnabled == false) {
                    return
                }
                const reducer = this.reducers.reducer
                const timerId = setInterval(() => {
                    return reducer(
                        reducerMethod.appState.contentType.channel.loadLatestMessages,
                        content
                    )
                }, 1000)
                // @ts-ignore
                this.timerIds.push(timerId)
            }
        }
        parentChannelGroupIdSet.forEach((channelGroupId) => {
            const timerId = setInterval(() => {
                return this.reducers.reducer(reducerMethod.domainData.channelGroup.listChannels, {
                    id: channelGroupId,
                })
            }, 1000)
            // @ts-ignore
            this.timerIds.push(timerId)
        })
    }
}

export const polling = new Polling()

export const useStore = (
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
