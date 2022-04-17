import { AppStateT, ContentStateT } from "../../store/types/app_state"

import { StoreT } from "../../store/types/store"

type ContentGridT = ContentStateT[][]

export const splitContentsInTwo = (
    contents: ContentGridT,
    edgeContentId: number
): [ContentGridT, ContentGridT] => {
    const before: ContentGridT = []
    const after: ContentGridT = []
    let stack = before
    contents.forEach((contentRows) => {
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
export const copyContents = (contents: ContentGridT) => {
    return contents.map((contentRows) => {
        return contentRows.map((content) => {
            return {
                id: content.id,
                type: content.type,
                row: content.row,
                column: content.column,
                postbox: {
                    enabled: content.postbox.enabled,
                    query: Object.assign({}, content.postbox.query),
                },
                options: {
                    showMutedMessage: content.options.showMutedMessage,
                },
                timeline: {
                    messageIds: content.timeline.messageIds.concat(),
                    isLoadingLatestMessagesEnabled: content.timeline.isLoadingLatestMessagesEnabled,
                    query: Object.assign({}, content.timeline.query),
                },
                context: Object.assign({}, content.context),
            } as ContentStateT
        })
    })
}
export const insertContent = (
    newContent: ContentStateT,
    contents: ContentGridT,
    insertAfter: number
): ContentGridT => {
    if (contents.length === 0) {
        return [[newContent]]
    }

    insertAfter = Number.isInteger(insertAfter) ? insertAfter : contents[contents.length - 1][0].id
    const [before, after] = splitContentsInTwo(contents, insertAfter)
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
    const nextAppState = store.appState
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
    const nextAppState = store.appState

    return [
        {
            domainData: store.domainData,
            appState: nextAppState,
        },
        null,
    ]
}
