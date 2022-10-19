import { AppStateSetActionT, AppStateT, ContentStateT } from "./types/app_state"
import { createContext, useState } from "react"

export const ContentType = {
    ChannelGroup: "ChannelGroup",
    Channel: "Channel",
    Thread: "Thread",
} as const

export const AppStateContext = createContext<AppStateT>({
    contents: [[]],
})

function addContentToNewColumnFactory(
    prevContents: ContentStateT[][],
    setContents: (newContents: ContentStateT[][]) => void
): AppStateSetActionT["addContentToNewColumn"] {
    return (newContent: ContentStateT) => {
        const newContentGrid = prevContents.map((rows) => rows.map((content) => content))
        // TODO: check duplicates
        newContentGrid.push([newContent])
        setContents(newContentGrid)
    }
}

function insertContentBetweenColumnFactory(
    prevContents: ContentStateT[][],
    setContents: (newContents: ContentStateT[][]) => void
): AppStateSetActionT["insertContentBetweenColumn"] {
    return (newContent: ContentStateT, beforeColumn: number) => {
        const newContentGrid = []
        let newColumn = 0
        for (let n = 0; n < prevContents.length; n++) {
            const prevContentRows = prevContents[n]
            const newContentRows = []
            prevContentRows.forEach((content) => {
                content.column = newColumn
                newContentRows.push(content)
            })
            newContentGrid.push(newContentRows)
            if (n == beforeColumn) {
                newColumn++
                newContent.column = newColumn
                newContent.row = 0
                newContentGrid.push(newContent)
            }
            newColumn++
        }
        setContents(newContentGrid)
    }
}

function insertContentBetweenRowFactory(
    prevContents: ContentStateT[][],
    setContents: (newContents: ContentStateT[][]) => void
): AppStateSetActionT["insertContentBetweenRow"] {
    return (newContent: ContentStateT, column: number, beforeRow: number) => {
        const newContents = prevContents.map((rows) => rows.map((content) => content))
        const prevContentRows = newContents[column]
        const newContentRows = []
        let newRow = 0
        for (let n = 0; n < prevContentRows.length; n++) {
            const content = prevContentRows[n]
            content.row = newRow
            newContentRows.push(content)
            if (n == beforeRow) {
                newRow++
                newContent.row = newRow
                newContentRows.push(newContent)
            }
            newRow++
        }
        setContents(newContents)
    }
}

function removeContentFactory(
    prevContents: ContentStateT[][],
    setContents: (newContents: ContentStateT[][]) => void
): AppStateSetActionT["removeContent"] {
    return (contentToRemove: ContentStateT) => {
        const newContents = prevContents.map((rows) => rows.map((content) => content))
        const prevContentRows = newContents[contentToRemove.column]
        const newContentRows = []
        let newRow = 0
        for (let n = 0; n < prevContentRows.length; n++) {
            if (n == contentToRemove.row) {
                continue
            }
            const content = prevContentRows[n]
            content.row = newRow
            newContentRows.push(content)
            newRow++
        }
        newContents[contentToRemove.column] = newContentRows
        setContents(newContents)
    }
}

export const useAppState = (
    initialContents: ContentStateT[][]
): [AppStateT, AppStateSetActionT] => {
    console.debug("useChatAppState")
    const [contents, setContents] = useState<AppStateT["contents"]>(initialContents)
    return [
        {
            contents,
        },
        {
            setContents,
            addContentToNewColumn: addContentToNewColumnFactory(contents, setContents),
            insertContentBetweenColumn: insertContentBetweenColumnFactory(contents, setContents),
            insertContentBetweenRow: insertContentBetweenRowFactory(contents, setContents),
            removeContent: removeContentFactory(contents, setContents),
        },
    ]
}
