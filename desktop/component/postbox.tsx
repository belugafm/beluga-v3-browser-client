import React, { useContext } from "react"
import { useTheme } from "./theme"
import { PostboxContext, usePostboxState } from "../state/postbox"
import { ColumnState, ChatAppStateContext } from "../state/chat/app"
import { ChatDomainDataContext } from "../state/chat/data"

export const PostboxComponent = ({
    column,
    channelId,
}: {
    column: ColumnState
    channelId: string
}) => {
    const [theme] = useTheme()
    const domainData = useContext(ChatDomainDataContext)
    const { textField, updateTextValue, updateStatus } = usePostboxState({
        query: column.postbox.query,
        domainData: domainData,
    })
    const { updateColumnTimeline } = useContext(ChatAppStateContext)
    const onClick = async (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        event.preventDefault()
        await updateStatus()
        await updateColumnTimeline(column)
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
