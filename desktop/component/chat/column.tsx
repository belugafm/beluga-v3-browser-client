import React, { useContext } from "react"
import { ColumnStateT } from "../../state/chat/state/app"
import { PostboxComponent } from "../postbox"
import { ChatDomainDataContext } from "../../state/chat/state/data"
import { StatusComponent } from "../status"
import { StatusMethods } from "../../state/status"
import { useLoggedInUser } from "../../state/session"

export const ChatColumnComponent = ({ column }: { column: ColumnStateT }) => {
    console.info("ChatColumnComponent::render")
    const domainData = useContext(ChatDomainDataContext)
    const methods = useContext(StatusMethods)
    const { loggedInUser } = useLoggedInUser()
    return (
        <div className="column">
            <p>{column.context.channelId}</p>
            <PostboxComponent column={column} channelId={column.context.channelId} />
            {column.timeline.statusIds.map((status_id, index) => {
                const status = domainData.statuses.get(status_id)
                if (status == null) {
                    return null
                }
                return (
                    <StatusComponent
                        key={status_id}
                        status={status}
                        methods={methods}
                        domainData={domainData}
                        loggedInUser={loggedInUser}
                    />
                )
            })}
        </div>
    )
}
