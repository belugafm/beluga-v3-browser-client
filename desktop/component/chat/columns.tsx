import React, { useContext } from "react"
import { ChatAppStateContext } from "../../state/chat/app"
import { ChatColumnComponent } from "./column"

export const ChatColumnContainerComponent = () => {
    const { columns } = useContext(ChatAppStateContext)
    return (
        <div className="column-container">
            <>
                {columns.map((column, index) => {
                    return <ChatColumnComponent key={index} column={column} />
                })}
            </>
            <style jsx>{`
                .column-container {
                    display: flex;
                }
            `}</style>
        </div>
    )
}
