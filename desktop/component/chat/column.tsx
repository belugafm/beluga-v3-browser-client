import React, { useContext } from "react"
import { ColumnStateT } from "../../state/chat/state/app"
import { PostboxComponent } from "../postbox"
import { ChatDomainDataContext } from "../../state/chat/state/data"
import { StatusComponent } from "../status"
import { StatusActions } from "../../state/status"
import { useLoggedInUser } from "../../state/session"
import { ChatActions } from "../../state/chat/actions"
import MenuComponent from "./column/menu"

export const ChatColumnComponent = ({ column }: { column: ColumnStateT }) => {
    console.info("ChatColumnComponent::render")
    const domainData = useContext(ChatDomainDataContext)
    const statusActions = useContext(StatusActions)
    const chatActions = useContext(ChatActions)
    const { loggedInUser } = useLoggedInUser()
    return (
        <>
            <div className="column">
                <p>カラム{column.index}</p>
                <MenuComponent column={column} chatActions={chatActions} />
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
                            statusActions={statusActions}
                            chatActions={chatActions}
                            domainData={domainData}
                            loggedInUser={loggedInUser}
                            column={column}
                        />
                    )
                })}
            </div>
            <style jsx>{`
                .column {
                    margin-right: 10px;
                }
            `}</style>
        </>
    )
}
