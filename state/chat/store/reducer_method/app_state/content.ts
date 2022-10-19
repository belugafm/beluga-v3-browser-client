import { copyAppState } from "../../app_state/copy"
import { copyDomainData } from "../../domain_data/copy"
import { ContentStateT } from "../../types/app_state"

import { StoreT } from "../../types/store"

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

export const setUpdatedAt = (
    prevStore: StoreT,
    prevContent: ContentStateT,
    updatedAt: Date
): [StoreT, null] => {
    const nextAppState = copyAppState(prevStore.appState)
    const nextContent = nextAppState["contents"][prevContent.column][prevContent.row]
    nextContent.updatedAt = updatedAt

    return [
        {
            domainData: copyDomainData(prevStore.domainData),
            appState: nextAppState,
        },
        null,
    ]
}

export const setUpdatedAtToAllContents = (prevStore: StoreT, updatedAt: Date): StoreT => {
    const nextAppState = copyAppState(prevStore.appState)
    for (const rows of nextAppState.contents) {
        for (const content of rows) {
            content.updatedAt = updatedAt
        }
    }

    return {
        domainData: copyDomainData(prevStore.domainData),
        appState: nextAppState,
    }
}
