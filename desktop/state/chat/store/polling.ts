import * as reducerMethod from "./reducer_method"

import { AppStateT } from "./types/app_state"
import { ReducersT } from "./types/reducer"

export class Polling {
    reducers: ReducersT
    appState: AppStateT
    timerIds: number[] = []
    use({ reducers, appState }: { reducers: ReducersT; appState: AppStateT }) {
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
                if (content.timeline.shouldFetch == false) {
                    return
                }
                if (content.context.channelId) {
                    const reducer = this.reducers.asyncReducer
                    const timerId = setInterval(() => {
                        return reducer(reducerMethod.appState.channel.loadLatestMessages, content)
                    }, 10000)
                    // @ts-ignore
                    this.timerIds.push(timerId)
                }
            }
        }
        parentChannelGroupIdSet.forEach((channelGroupId) => {
            const timerId = setInterval(() => {
                return this.reducers.asyncReducer(
                    reducerMethod.domainData.channelGroup.listChannels,
                    {
                        id: channelGroupId,
                    }
                )
            }, 10000)
            // @ts-ignore
            this.timerIds.push(timerId)
        })
    }
}
