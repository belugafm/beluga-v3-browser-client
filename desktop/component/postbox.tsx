import React, { useReducer, useContext } from "react"
import { useTheme } from "./theme"
import { PostboxContext, usePostboxState } from "../state/postbox"
import { ColumnStateT } from "../state/chat/state/app"
import * as reducers from "../state/chat/reducer_methods"
import { ChatReducerContext } from "../state/chat/reducer"

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
    const { reducer } = useContext(ChatReducerContext)
    const onClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault()
        await updateStatus()
        await reducer(reducers.columns.channel.updateTimeline, column.timeline.query)
    }
    return (
        <PostboxContext.Provider value={{ textField, updateTextValue, updateStatus }}>
            <div className="postbox">
                <div>
                    <textarea value={textField.value} onChange={updateTextValue} />
                </div>
                <div>
                    <button onClick={onClick}>投稿する</button>
                </div>
            </div>
        </PostboxContext.Provider>
    )
}
