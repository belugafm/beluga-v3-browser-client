import React, { useContext } from "react"
import { useTheme } from "./theme"
import { PostboxContext, usePostboxState } from "../state/postbox"
import { ColumnStateT, ChatAppStateContext } from "../state/chat/app"
import { ChatReducerContext } from "../state/chat/reducer"
import { ChatDomainDataContext } from "../state/chat/data"
import * as reducers from "../state/chat/reducers"

export const PostboxComponent = ({
    column,
    channelId,
}: {
    column: ColumnStateT
    channelId: string
}) => {
    const [theme] = useTheme()
    const { textField, updateTextValue, updateStatus } = usePostboxState({
        query: column.postbox.query,
    })
    const domainData = useContext(ChatDomainDataContext)
    const appState = useContext(ChatAppStateContext)
    const { reducer } = useContext(ChatReducerContext)
    const onClick = async (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        event.preventDefault()
        await updateStatus()
        await reducer(
            { domainData, appState },
            reducers.columns.channel.updateTimeline,
            column.timeline.query
        )
    }
    return (
        <PostboxContext.Provider
            value={{ textField, updateTextValue, updateStatus }}>
            <div className="postbox">
                <div>
                    <textarea
                        value={textField.value}
                        onChange={updateTextValue}
                    />
                </div>
                <div>
                    <button onClick={onClick}>投稿する</button>
                </div>
            </div>
        </PostboxContext.Provider>
    )
}
