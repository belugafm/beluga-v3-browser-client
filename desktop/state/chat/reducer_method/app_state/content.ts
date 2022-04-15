import { AppStateT, ContentStateT } from "../../store/app_state"

import { ContentGridT } from "../../store/app_state"
import { StoreT } from "../../store/reducer"

export const splitContentsInTwo = (
    contentGrid: ContentGridT,
    edgeContentId: number
): [ContentGridT, ContentGridT] => {
    const before: ContentGridT = []
    const after: ContentGridT = []
    let stack = before
    contentGrid.forEach((contentRows) => {
        let reachedEdge = false
        stack.push(contentRows)
        contentRows.forEach((row) => {
            if (row.id === edgeContentId) {
                reachedEdge = true
            }
        })
        if (reachedEdge) {
            stack = after
        }
    })
    return [before, after]
}
export const copyContents = (contentGrid: ContentGridT) => {
    return contentGrid.map((contentRows) => {
        return contentRows.map((content) => {
            return {
                id: content.id,
                type: content.type,
                postbox: {
                    enabled: content.postbox.enabled,
                    query: Object.assign({}, content.postbox.query),
                },
                options: {
                    showMutedMessage: content.options.showMutedMessage,
                },
                timeline: {
                    messageIds: content.timeline.messageIds.concat(),
                    query: Object.assign({}, content.timeline.query),
                },
                context: Object.assign({}, content.context),
            }
        })
    })
}
export const findByIndex = (contentGrid: ContentGridT, index: number): ContentStateT | null => {
    for (let n = 0; n < contentGrid.length; n++) {
        const content = contentGrid[n]
        if (content.id === index) {
            return content
        }
    }
    return null
}
export const insertContent = (
    newContent: ContentStateT,
    contentGrid: ContentGridT,
    insertAfter: number
): ContentGridT => {
    if (contentGrid.length === 0) {
        return [[newContent]]
    }

    insertAfter = Number.isInteger(insertAfter)
        ? insertAfter
        : contentGrid[contentGrid.length - 1][0].id
    const [before, after] = splitContentsInTwo(contentGrid, insertAfter)
    const nextGrid: ContentGridT = []
    before.forEach((contentRows) => nextGrid.push(contentRows))
    nextGrid.push([newContent])
    after.forEach((contentRows) => nextGrid.push(contentRows))

    return nextGrid
}
export const setOptions = async (
    store: StoreT,
    params: {
        content: ContentStateT
        options: ContentStateT["options"]
    }
): Promise<[StoreT, null]> => {
    const nextAppState: AppStateT = {
        contentGrid: this.copyContents(store.appState.contentGrid),
    }

    const content = this.findByIndex(nextAppState.contentGrid, params.content.id)
    content.options = params.options

    return [
        {
            domainData: store.domainData,
            appState: nextAppState,
        },
        null,
    ]
}
export const close = async (
    store: StoreT,
    desiredColumn: ContentStateT
): Promise<[StoreT, null]> => {
    const nextAppState: AppStateT = {
        contentGrid: copyContents(
            store.appState.contentGrid.filter((content) => content.id !== desiredColumn.id)
        ),
    }

    return [
        {
            domainData: store.domainData,
            appState: nextAppState,
        },
        null,
    ]
}
