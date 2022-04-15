import { Action, ActionT } from "../../../state/chat/store/action"
import React, { useContext, useRef } from "react"
import { Themes, useTheme } from "../../theme"

import { ContentStateT } from "../../../state/chat/store/app_state"
import { DomainDataContext } from "../../../state/chat/store/domain_data"
import { HeaderComponent } from "./header"
import MenuComponent from "../content/menu"
import { MessageAction } from "../../../state/chat/components/message"
import { MessageComponent } from "../message"
import { PostboxComponent } from "../postbox"
import config from "../../../config"
import { swrShowLoggedInUser } from "../../../swr/session"

function findMaxId(messageIds: string[]) {
    if (messageIds.length > config.timeline.maxNumStatuses) {
        return messageIds[messageIds.length - config.timeline.maxNumStatuses - 1]
    }
    return null
}

function findSinceId(messageIds: string[]) {
    if (messageIds.length > config.timeline.maxNumStatuses) {
        return messageIds[config.timeline.maxNumStatuses + 1]
    }
    return null
}

class Scroller {
    ref: React.MutableRefObject<any>
    content: ContentStateT
    chatActions: ActionT
    reqeustedMaxId: string
    reqeustedSinceId: string
    loading: boolean = false
    hasReachedTop: boolean = false
    hasReachedBottom: boolean = false
    scrolled: boolean = false
    prevScrollTop: number = 0
    use = ({
        ref,
        content,
        chatActions,
    }: {
        ref: React.MutableRefObject<any>
        content: ContentStateT
        chatActions: ActionT
    }) => {
        this.ref = ref
        this.content = content
        this.chatActions = chatActions
        this.reqeustedMaxId = "000000000000"
    }
    handleScroll = async (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
        if (this.loading) {
            return
        }
        return
        const { content, chatActions } = this
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
                    const maxId = findMaxId(content.timeline.messageIds)
                    if (maxId === this.reqeustedMaxId) {
                        return
                    }
                    this.loading = true
                    const limit = config.timeline.maxNumStatuses * 2
                    const responce = await chatActions.content.setTimelineQuery(
                        content,
                        Object.assign({}, content.timeline.query, {
                            maxId,
                            limit,
                            sinceId: null,
                        })
                    )
                    const { messages: statuses } = responce
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
                    const sinceId = findSinceId(content.timeline.messageIds)
                    if (sinceId === this.reqeustedSinceId) {
                        console.log("sinceId === this.reqeustedSinceId")
                        return
                    }
                    this.loading = true
                    const limit = config.timeline.maxNumStatuses * 2
                    const responce = await chatActions.content.setTimelineQuery(
                        content,
                        Object.assign({}, content.timeline.query, {
                            sinceId,
                            limit,
                            maxId: null,
                        })
                    )
                    const { messages: statuses } = responce
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

const getStyleForTheme = (theme: Themes) => {
    if (theme.global.current.light) {
        return {
            color: "#000",
            backgroundColor: "#fff",
        }
    }
    if (theme.global.current.dark) {
        return {
            color: "#fcfcfc",
            backgroundColor: "#1a1c1f",
        }
    }
    throw new Error()
}

export const ContentComponent = ({ content }: { content: ContentStateT }) => {
    console.info("ContentComponent::render")
    const domainData = useContext(DomainDataContext)
    const messageActions = useContext(MessageAction)
    const chatActions = useContext(Action)
    const { loggedInUser } = swrShowLoggedInUser()
    const scrollerRef = useRef(null)
    const [theme] = useTheme()
    scroller.use({
        ref: scrollerRef,
        content: content,
        chatActions: chatActions,
    })
    return (
        <>
            <div className="content-container">
                <div className="content">
                    <div className="menu">
                        <HeaderComponent content={content} />
                    </div>
                    <div className="scroller-container" onScroll={scroller.handleScroll}>
                        <div className="scroller" ref={scrollerRef}>
                            {content.timeline.messageIds.map((messageId) => {
                                const message = domainData.messages.get(messageId)
                                if (message == null) {
                                    return null
                                }
                                return (
                                    <MessageComponent
                                        key={messageId}
                                        message={message}
                                        messageActions={messageActions}
                                        chatActions={chatActions}
                                        domainData={domainData}
                                        loggedInUser={loggedInUser}
                                        content={content}
                                    />
                                )
                            })}
                        </div>
                    </div>
                    <div className="postbox">
                        <PostboxComponent content={content} />
                    </div>
                </div>
            </div>
            <style jsx>{`
                .content-container {
                    width: 400px;
                    flex: 1 1 auto;
                    padding: 8px;
                    display: flex;
                    min-height: 300px;
                }
                .content {
                    width: 100%;
                    min-height: 0;
                    display: flex;
                    flex-direction: column;
                    flex: 1 1 auto;
                    box-sizing: border-box;
                    border-radius: 8px;
                    position: relative;
                    overflow: hidden;
                }
                .content-container:first-child {
                    padding-top: 16px;
                }
                .content-container:last-child {
                    padding-bottom: 16px;
                }
                .menu {
                    flex: 0 0 auto;
                    z-index: 3;
                }
                .postbox {
                    flex: 0 0 auto;
                    z-index: 2;
                }
                .scroller-container {
                    min-width: 0;
                    min-height: 0;
                    display: flex;
                    flex-direction: column;
                    flex: 1 1 auto;
                    z-index: 1;
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
                .scroller {
                    flex: 1 1 auto;
                    display: flex;
                    flex-direction: column-reverse;
                    overflow-x: hidden;
                    overflow-y: scroll;
                }
            `}</style>
            <style jsx>{`
                .content-container {
                    color: ${getStyleForTheme(theme)["color"]};
                }
                .content {
                    background-color: ${getStyleForTheme(theme)["backgroundColor"]};
                }
            `}</style>
        </>
    )
}
