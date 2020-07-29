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
            <div className="column-container">
                <div className="column">
                    <div className="menu">
                        <p>カラム{column.id}</p>
                        <MenuComponent column={column} chatActions={chatActions} />
                    </div>
                    <div className="postbox">
                        <PostboxComponent column={column} channelId={column.context.channelId} />
                    </div>
                    <div className="scroller-container">
                        <div className="scroller">
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
                    </div>
                </div>
            </div>
            <style jsx>{`
                .column-container {
                    width: 400px;
                    flex: 0 0 auto;
                    padding: 12px 0 12px 12px;
                    display: flex;
                }
                .column {
                    width: 100%;
                    background-color: white;
                    min-height: 0;
                    display: flex;
                    flex-direction: column;
                    flex: 1 1 auto;
                    box-sizing: border-box;
                }
                .menu {
                    flex: 0 0 auto;
                }
                .postbox {
                    flex: 0 0 auto;
                }
                .scroller-container {
                    min-width: 0;
                    min-height: 0;
                    display: flex;
                    flex-direction: column;
                    flex: 1 1 auto;
                }
                .scroller {
                    overflow-x: hidden;
                    overflow-y: scroll;
                    flex: 1 1 auto;
                }
                .scroller::-webkit-scrollbar {
                    width: 0px;
                }
                .scroller::-webkit-scrollbar-thumb {
                    border-radius: 10px;
                    background-color: gray;
                }
                .scroller::-webkit-scrollbar-track-piece {
                    background-clip: padding-box;
                    background-color: transparent;
                    border-color: transparent;
                }
            `}</style>
        </>
    )
}
