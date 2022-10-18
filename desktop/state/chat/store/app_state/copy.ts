import { AppStateT, ContentStateT } from "../types/app_state"

type ContentGridT = ContentStateT[][]

export const copyContents = (contents: ContentGridT): ContentGridT => {
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
                    mode: content.timeline.mode,
                    lastMessageId: content.timeline.lastMessageId,
                    messageIds: content.timeline.messageIds.concat(),
                    query: Object.assign({}, content.timeline.query),
                },
                context: Object.assign({}, content.context),
            } as ContentStateT
        })
    })
}

export const copyAppState = (appState: AppStateT): AppStateT => {
    return {
        contents: copyContents(appState.contents),
    }
}
