import React from "react"
import { useTheme } from "./theme"
import { PostboxContext, usePostboxState } from "../state/postbox"
import { ColumnStateT } from "../state/chat/state/app"

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
    const handleClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault()
        await updateStatus()
    }
    return (
        <PostboxContext.Provider value={{ textField, updateTextValue, updateStatus }}>
            <div className="postbox">
                <div>
                    <textarea value={textField.value} onChange={updateTextValue} />
                </div>
                <div>
                    <button onClick={handleClick}>投稿する</button>
                </div>
            </div>
        </PostboxContext.Provider>
    )
}
