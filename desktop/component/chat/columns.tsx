import React, { useContext } from "react"
import { ChatAppStateContext } from "../../state/chat/state/app"
import { ChatColumnComponent } from "./column"
import { ThemeSettingComponent } from "../sidebar/settings/theme"

export const ChatColumnContainerComponent = () => {
    const { columns } = useContext(ChatAppStateContext)
    return (
        <div className="column-container">
            <>
                {columns.map((column) => {
                    return <ChatColumnComponent key={column.id} column={column} />
                })}
                <ThemeSettingComponent />
            </>
            <style jsx>{`
                .column-container {
                    display: flex;
                }
            `}</style>
        </div>
    )
}
