import { ChatActions, ChatActionsT } from "../../state/chat/actions"
import React, { useContext, useRef } from "react"

import { ChatDomainDataContext } from "../../state/chat/state/data"
import { ColumnStateT } from "../../state/chat/state/app"
import MenuComponent from "./column/menu"
import { PostboxComponent } from "../postbox"
import { StatusActions } from "../../state/status"
import { StatusComponent } from "../status"
import config from "../../config"
import { useLoggedInUser } from "../../state/session"

function findMaxId(statusIds: string[]) {
    if (statusIds.length > config.timeline.maxNumStatuses) {
        return statusIds[statusIds.length - config.timeline.maxNumStatuses - 1]
    }
    return null
}

function findSinceId(statusIds: string[]) {
    if (statusIds.length > config.timeline.maxNumStatuses) {
        return statusIds[config.timeline.maxNumStatuses + 1]
    }
    return null
}

class Scroller {
    ref: React.MutableRefObject<any>
    column: ColumnStateT
    chatActions: ChatActionsT
    reqeustedMaxId: string
    reqeustedSinceId: string
    loading: boolean = false
    hasReachedTop: boolean = false
    hasReachedBottom: boolean = false
    scrolled: boolean = false
    prevScrollTop: number = 0
    use = ({
        ref,
        column,
        chatActions,
    }: {
        ref: React.MutableRefObject<any>
        column: ColumnStateT
        chatActions: ChatActionsT
    }) => {
        this.ref = ref
        this.column = column
        this.chatActions = chatActions
        this.reqeustedMaxId = "000000000000"
    }
    handleScroll = async (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
        if (this.loading) {
            return
        }
        const { column, chatActions } = this
        const container = event.target as HTMLDivElement
        const scroller = this.ref.current as HTMLDivElement
        const threashold = 100
        if (container) {
            const scrollBottom =
                scroller.clientHeight - container.clientHeight - container.scrollTop
            const direction = container.scrollTop - this.prevScrollTop
            this.prevScrollTop = container.scrollTop
            console.log(container.scrollTop, scrollBottom, direction)
            if (direction > 0) {
                if (scrollBottom < threashold) {
                    if (this.hasReachedBottom) {
                        return
                    }
                    const maxId = findMaxId(column.timeline.statusIds)
                    if (maxId === this.reqeustedMaxId) {
                        return
                    }
                    this.loading = true
                    const limit = config.timeline.maxNumStatuses * 2
                    const responce = await chatActions.column.setTimelineQuery(
                        column,
                        Object.assign({}, column.timeline.query, {
                            maxId,
                            limit,
                            sinceId: null,
                        })
                    )
                    const { statuses } = responce
                    if (statuses.length < limit) {
                        this.hasReachedBottom = true
                    }
                    this.reqeustedMaxId = maxId
                    this.loading = false
                    this.hasReachedTop = false
                    this.scrolled = true
                    return
                }
            } else {
                if (container.scrollTop < threashold) {
                    if (this.scrolled === false) {
                        console.log("this.scrolled === false")
                        return
                    }
                    if (this.hasReachedTop) {
                        console.log("this.hasReachedTop")
                        return
                    }
                    const sinceId = findSinceId(column.timeline.statusIds)
                    if (sinceId === this.reqeustedSinceId) {
                        console.log("sinceId === this.reqeustedSinceId")
                        return
                    }
                    this.loading = true
                    const limit = config.timeline.maxNumStatuses * 2
                    const responce = await chatActions.column.setTimelineQuery(
                        column,
                        Object.assign({}, column.timeline.query, {
                            sinceId,
                            limit,
                            maxId: null,
                        })
                    )
                    const { statuses } = responce
                    if (statuses.length < limit) {
                        this.hasReachedTop = true
                    }
                    this.reqeustedSinceId = sinceId
                    this.loading = false
                    this.hasReachedBottom = false
                    return
                }
                if (container.scrollTop > 400) {
                    this.scrolled = true
                }
            }
        }
    }
}

const scroller = new Scroller()

export const ChatColumnComponent = ({ column }: { column: ColumnStateT }) => {
    console.info("ChatColumnComponent::render")
    const domainData = useContext(ChatDomainDataContext)
    const statusActions = useContext(StatusActions)
    const chatActions = useContext(ChatActions)
    const { loggedInUser } = useLoggedInUser()
    const scrollerRef = useRef(null)
    scroller.use({
        ref: scrollerRef,
        column: column,
        chatActions: chatActions,
    })
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
                    <div className="scroller-container" onScroll={scroller.handleScroll}>
                        <div className="scroller" ref={scrollerRef}>
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
                    overflow-x: hidden;
                    overflow-y: scroll;
                }
                .scroller-container::-webkit-scrollbar {
                    width: 0px;
                }
                .scroller-container::-webkit-scrollbar-thumb {
                    border-radius: 10px;
                    background-color: gray;
                }
                .scroller-container::-webkit-scrollbar-track-piece {
                    background-clip: padding-box;
                    background-color: transparent;
                    border-color: transparent;
                }
                .scroller {
                    flex: 1 1 auto;
                }
            `}</style>
        </>
    )
}
