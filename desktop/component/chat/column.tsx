import React, { useContext } from "react"
import { ColumnStateT } from "../../state/chat/app"
import { PostboxComponent } from "../postbox"
import { ChatDomainDataContext } from "../../state/chat/data"
import { StatusComponent } from "../status"
import { StatusMethods } from "../../state/status"

export const ChatColumnComponent = ({ column }: { column: ColumnStateT }) => {
    console.info("ChatColumnComponent::render")
    const { statusesById } = useContext(ChatDomainDataContext)
    const methods = useContext(StatusMethods)
    return (
        <div className="column">
            <p>{column.context.channelId}</p>
            <PostboxComponent column={column} channelId={column.context.channelId} />
            {column.timeline.statusIds.map((status_id, index) => {
                const status = statusesById[status_id]
                if (status == null) {
                    return null
                }
                return <StatusComponent key={status_id} status={status} methods={methods} />
            })}
        </div>
    )
}
