import React, { useContext } from "react"
import { useTheme } from "./theme"
import { PostboxContext, usePostboxState } from "../state/postbox"
import { ColumnState, ChatUIStateContext } from "../state/chat/ui_state"

export const PostboxComponent = ({
    column,
    channelId,
}: {
    column: ColumnState
    channelId: string
}) => {
    const [theme] = useTheme()
    const { textField, handleUpdateTextValue, handleUpdate } = usePostboxState(
        channelId
    )
    const { handleUpdateColumnTimeline } = useContext(ChatUIStateContext)
    const onClick = async (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        event.preventDefault()
        await handleUpdate()
        await handleUpdateColumnTimeline(column)
    }
    return (
        <PostboxContext.Provider
            value={{ textField, handleUpdateTextValue, handleUpdate }}>
            <div className="postbox">
                <div>
                    <textarea
                        value={textField.value}
                        onChange={handleUpdateTextValue}
                    />
                </div>
                <div>
                    <button onClick={onClick}>投稿する</button>
                </div>
            </div>
        </PostboxContext.Provider>
    )
}
