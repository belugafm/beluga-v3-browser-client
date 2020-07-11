import React, { useContext } from "react"
import { ColumnState } from "../../state/chat/app"
import { PostboxComponent } from "../postbox"
import { ThemeSettingComponent } from "../sidebar/settings/theme"
import { ChatDomainDataContext } from "../../state/chat/data"

export const ChatColumnComponent = ({ column }: { column: ColumnState }) => {
    const { statusesById } = useContext(ChatDomainDataContext)
    return (
        <div className="column">
            <p>{column.context.channel_id}</p>
            <PostboxComponent
                column={column}
                channelId={column.context.channel_id}
            />
            {column.timeline.status_ids.map((status_id, index) => {
                const status = statusesById[status_id]
                if (status == null) {
                    return null
                }
                return <div key={index}>{status.text}</div>
            })}
            <ThemeSettingComponent />
        </div>
    )
}
