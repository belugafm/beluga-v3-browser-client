import React, { useRef } from "react"
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
    const textarea = useRef(null)
    const handleClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault()
        await updateStatus()
        textarea.current.focus()
    }
    return (
        <PostboxContext.Provider value={{ textField, updateTextValue, updateStatus }}>
            <div className="postbox">
                <div>
                    <textarea value={textField.value} onChange={updateTextValue} ref={textarea} />
                </div>
                <div>
                    <button onClick={handleClick}>投稿する</button>
                </div>
            </div>
        </PostboxContext.Provider>
    )
}
