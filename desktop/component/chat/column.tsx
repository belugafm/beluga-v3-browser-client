import React from "react"
import { ColumnState } from "../../state/chat/ui_state"
import { PostboxComponent } from "../postbox"
import { ThemeSettingComponent } from "../sidebar/settings/theme"

export const ChatColumnComponent = ({ column }: { column: ColumnState }) => {
    return (
        <div className="column">
            <p>{column.context.channel.id}</p>
            <PostboxComponent
                column={column}
                channelId={column.context.channel.id}
            />
            {column.timeline.statuses.map((status, index) => {
                return <div key={index}>{status.text}</div>
            })}
            <ThemeSettingComponent />
        </div>
    )
}
