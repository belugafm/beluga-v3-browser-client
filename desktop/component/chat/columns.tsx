import React, { useContext } from "react"

import { ChatAppStateContext } from "../../state/chat/store/app_state"
import { ChatColumnComponent } from "./column"

export const ChatColumnContainerComponent = () => {
    const { columns } = useContext(ChatAppStateContext)
    return (
        <div className="columns">
            <>
                {columns.map((column) => {
                    return <ChatColumnComponent key={column.id} column={column} />
                })}
            </>
            <style jsx>{`
                .columns {
                    display: flex;
                    flex-direction: row;
                    flex: 1 1 auto;
                    overflow-x: auto;
                }
            `}</style>
        </div>
    )
}
