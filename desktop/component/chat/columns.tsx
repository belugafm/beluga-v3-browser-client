import React, { useContext } from "react"
import { ChatUIStateContext } from "../../state/chat/ui_state"
import { ChatColumnComponent } from "./column"

export const ChatColumnContainerComponent = () => {
    const { columns } = useContext(ChatUIStateContext)
    return (
        <div className="column-container">
            <>
                {columns.map((column, index) => {
                    return <ChatColumnComponent key={index} column={column} />
                })}
            </>
        </div>
    )
}
