import React from "react"
import { useTheme } from "./theme"
import { PostboxContext, usePostboxState } from "../state/postbox"

export const PostboxComponent = ({ channelId }: { channelId: string }) => {
    const [theme] = useTheme()
    const { textField, handleUpdateTextValue, handleUpdate } = usePostboxState(
        channelId
    )
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
                    <button onClick={handleUpdate}>投稿する</button>
                </div>
            </div>
        </PostboxContext.Provider>
    )
}
