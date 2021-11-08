import React, { useContext } from "react"

import { ChatAppStateContext } from "../../state/chat/state/app"
import { ChatColumnComponent } from "./column"
import { ThemeSettingComponent } from "../sidebar/settings/theme"

export const ChatColumnContainerComponent = () => {
    const { columns } = useContext(ChatAppStateContext)
    return (
        <div className="columns">
            <>
                {columns.map((column) => {
                    return <ChatColumnComponent key={column.id} column={column} />
                })}
                <ThemeSettingComponent />
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
