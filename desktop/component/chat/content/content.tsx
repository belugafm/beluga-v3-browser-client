import React, { useCallback, useContext, useMemo, useRef } from "react"
import { Themes, useTheme } from "../../theme"

import { ContentActionContext } from "../../../state/chat/actions/contents"
import { ContentStateT } from "../../../state/chat/store/types/app_state"
import { DeleteMessageModalActionContext } from "../../../state/component/model/delete_message"
import { DomainDataContext } from "../../../state/chat/store/domain_data"
import { HeaderComponent } from "./header"
import { MessageActionContext } from "../../../state/chat/actions/message"
import { MessageComponent } from "../message"
import { ChannelId, MessageObjectT, UserId } from "../../../api/object"
import { PostboxComponent } from "../postbox"
import { ScrollerState } from "../../../state/chat/components/scroller"
import { TextComponent } from "../message/text"
import { TooltipActionContext } from "../../../state/component/tooltip"
import { swrShowLoggedInUser } from "../../../swr/session"
import { unnormalizeMessage } from "../../../state/chat/store/domain_data/unnormalize"

const getStyleForTheme = (theme: Themes) => {
    if (theme.global.current.light) {
        return {
            color: "#000",
            backgroundColor: "#fff",
            scrollbarThumbColor: "#d8dadc",
        }
    }
    if (theme.global.current.dark) {
        return {
            color: "#fcfcfc",
            backgroundColor: "#1a1c1f",
            scrollbarThumbColor: "#616d78",
        }
    }
    throw new Error()
}

export class CheckIsConsecutivePost {
    private lastUserId: UserId | null
    private lastChannelId: ChannelId | null
    private lastCreatedAt: number | null
    private consectivePeriodInSec: number
    constructor() {
        this.lastUserId = null
        this.lastChannelId = null
        this.lastCreatedAt = null
        this.consectivePeriodInSec = 300
    }
    check(message: MessageObjectT): boolean {
        if (this.lastUserId == null) {
            this.lastUserId = message.user_id
            this.lastChannelId = message.channel_id
            this.lastCreatedAt = message.created_at.getTime()
            return false
        }
        if (this.lastChannelId != message.channel_id) {
            this.lastUserId = message.user_id
            this.lastChannelId = message.channel_id
            this.lastCreatedAt = message.created_at.getTime()
            return false
        }
        if (this.lastUserId != message.user_id) {
            this.lastUserId = message.user_id
            this.lastCreatedAt = message.created_at.getTime()
            return false
        }
        if (message.created_at.getTime() - this.lastCreatedAt > 1000 * this.consectivePeriodInSec) {
            this.lastUserId = message.user_id
            this.lastCreatedAt = message.created_at.getTime()
            return false
        }
        this.lastUserId = message.user_id
        this.lastCreatedAt = message.created_at.getTime()
        return true
    }
}

const EmptyContentComponent = () => {
    return (
        <div className="empty-timeline">
            <div className="inner">
                <div className="chat-image"></div>
                <div className="description">
                    <span>このチャンネルにはまだ投稿がありません</span>
                    <span>最初のメッセージを投稿してみましょう！</span>
                </div>
            </div>
            <style jsx>{`
                .empty-timeline {
                    flex: 1 1 auto;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                .chat-image {
                    height: 300px;
                    background-image: url("/assets/svg/chat.svg");
                    background-repeat: no-repeat;
                    background-size: 300px auto;
                    background-position: center;
                }
                .description {
                    text-align: center;
                }
                span {
                    display: block;
                    line-height: 2em;
                    font-size: 16px;
                }
            `}</style>
        </div>
    )
}

const NewMessageNotificationComponent = ({
    scrollerState,
    theme,
}: {
    scrollerState: ScrollerState
    theme: Themes
}) => {
    if (scrollerState.shouldNotifyNewMessages) {
        const getStyle = (theme: Themes) => {
            if (theme.global.current.light) {
                return {
                    fill: "#fff",
                    hoverFill: "#fff",
                    backgroundColor: "#2a85ff",
                    hoverBackgroundColor: "#0069f6",
                    focusBackgroundColor: "#2a85ff",
                }
            }
            if (theme.global.current.dark) {
                return {
                    fill: "#fff",
                    hoverFill: "#fff",
                    backgroundColor: "#2a85ff",
                    hoverBackgroundColor: "#0069f6",
                    focusBackgroundColor: "#2a85ff",
                }
            }
            throw new Error()
        }

        return (
            <>
                <div className="container">
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            scrollerState.scrollToBottom()
                        }}>
                        <svg className="icon">
                            <use href="#icon-chat-notification"></use>
                        </svg>
                        <span>新しいメッセージ</span>
                    </button>
                </div>
                <style jsx>{`
                    .container {
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        z-index: 2;
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: center;
                    }
                    .icon {
                        width: 18px;
                        height: 18px;
                        text-align: center;
                        flex-shrink: 0;
                        margin: 1px 4px 0 0;
                    }
                    button {
                        cursor: pointer;
                        height: 32px;
                        border-radius: 18px;
                        outline: none;
                        border: none;
                        background-color: transparent;
                        transition: 0.1s;
                        font-weight: 500;
                        padding: 0 20px;
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: center;
                        font-size: 14px;
                        line-height: 32px;
                    }
                `}</style>
                <style jsx>{`
                    button {
                        color: ${getStyle(theme)["fill"]};
                        background-color: ${getStyle(theme)["backgroundColor"]};
                    }
                    button:hover {
                        background-color: ${getStyle(theme)["hoverBackgroundColor"]};
                    }
                    .icon {
                        fill: ${getStyle(theme)["fill"]};
                    }
                `}</style>
            </>
        )
    }
    return null
}

const SpacerComponent = () => {
    return (
        <div className="spacer">
            <style jsx>{`
                .spacer {
                    flex: 1 1 auto;
                }
            `}</style>
        </div>
    )
}

const isEmpty = (content: ContentStateT) => {
    if (content.timeline.messageIds.length == 0) {
        return true
    }
    return false
}

const DebugMessageComponent = ({ scrollerState }: { scrollerState: ScrollerState }) => {
    return (
        <div className="debug-message">
            <div className="panel">
                <p>
                    <span className="key">shouldNotifyNewMessages:</span>
                    <span className="value">
                        {scrollerState.shouldNotifyNewMessages ? "true" : "false"}
                    </span>
                </p>
            </div>
            <div className="panel">
                <p>
                    <span className="key">hasReachedBottom:</span>
                    <span className="value">
                        {scrollerState.hasReachedBottom ? "true" : "false"}
                    </span>
                </p>
                <p>
                    <span className="key">forceScrollToBottom:</span>
                    <span className="value">
                        {scrollerState.forceScrollToBottom ? "true" : "false"}
                    </span>
                </p>
            </div>
            <div className="panel">
                <p>
                    <span className="key">hasReachedTop:</span>
                    <span className="value">{scrollerState.hasReachedTop ? "true" : "false"}</span>
                </p>
                <p>
                    <span className="key">lastReadLatestMessageId:</span>
                    <span className="value">{scrollerState.lastReadLatestMessageId}</span>
                </p>
            </div>
            <style jsx>{`
                .debug-message {
                    flex: 0 0 auto;
                    text-align: right;
                    font-size: 11px;
                    display: flex;
                    flex-direction: row;
                }
                .panel {
                    flex: 1 1 auto;
                }
                p {
                    line-height: 11px;
                }
                span {
                    display: inline-block;
                }
                .value {
                    font-weight: 500;
                    width: 30px;
                }
            `}</style>
        </div>
    )
}

export const ContentComponent = ({ content }: { content: ContentStateT }) => {
    console.debug("ContentComponent::render")
    const domainData = useContext(DomainDataContext)
    const messageAction = useContext(MessageActionContext)
    const contentAction = useContext(ContentActionContext)
    const tooltipAction = useContext(TooltipActionContext)
    const deleteMessageModalAction = useContext(DeleteMessageModalActionContext)
    const { loggedInUser } = swrShowLoggedInUser()
    const scrollerRef = useRef(null)
    const [theme] = useTheme()
    const scrollerState = useMemo(() => new ScrollerState(), [content.id])
    scrollerState.use({
        ref: scrollerRef,
        content: content,
        contentAction: contentAction,
    })
    const consectivePostChecker = new CheckIsConsecutivePost()
    const messageComponentList = [...content.timeline.messageIds].reverse().map((messageId, n) => {
        const normalizedMessage = domainData.messages.get(messageId)
        if (normalizedMessage == null) {
            return null
        }
        const message = unnormalizeMessage(normalizedMessage, domainData)
        return (
            <MessageComponent
                key={messageId}
                message={message}
                messageAction={messageAction}
                contentAction={contentAction}
                tooltipAction={tooltipAction}
                deleteMessageModalAction={deleteMessageModalAction}
                domainData={domainData}
                loggedInUser={loggedInUser}
                content={content}
                isConsecutivePost={consectivePostChecker.check(message)}
                zIndex={n}
                theme={theme}>
                <TextComponent
                    message={message}
                    messageAction={messageAction}
                    contentAction={contentAction}
                    tooltipAction={tooltipAction}
                    deleteMessageModalAction={deleteMessageModalAction}
                    domainData={domainData}
                    loggedInUser={loggedInUser}
                    content={content}
                    isConsecutivePost={consectivePostChecker.check(message)}
                    theme={theme}
                />
            </MessageComponent>
        )
    })
    if (isEmpty(content)) {
        messageComponentList.push(<EmptyContentComponent key="empty" />)
    } else {
        messageComponentList.unshift(<SpacerComponent key="spacer" />)
    }
    return (
        <>
            <div className="content-container">
                <div className="content">
                    <div className="menu">
                        <HeaderComponent content={content} />
                        <DebugMessageComponent scrollerState={scrollerState} />
                    </div>
                    <div className="scroller-container">
                        <div
                            className="scroller"
                            ref={scrollerRef}
                            onScroll={scrollerState.handleScroll}>
                            <div className="message-container">{messageComponentList}</div>
                        </div>
                        <NewMessageNotificationComponent
                            scrollerState={scrollerState}
                            theme={theme}
                        />
                    </div>
                    <div className="postbox">
                        <PostboxComponent content={content} tooltipAction={tooltipAction} />
                    </div>
                </div>
            </div>
            <style jsx>{`
                .content-container {
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
                    padding: 0;
                    margin: 0;
                    min-width: 0;
                    min-height: 0;
                    display: flex;
                    flex-direction: column;
                    flex: 1 1 auto;
                    z-index: 1;
                    position: relative;
                }
                .scroller::-webkit-scrollbar {
                    width: 6px;
                }
                .scroller::-webkit-scrollbar-thumb {
                    border-radius: 10px;
                    background-color: transparent;
                    transition: 0.5s;
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
                    position: relative;
                    z-index: 1;
                }
                .message-container {
                    flex: 1 1 auto;
                    display: flex;
                    flex-direction: column;
                    transform: translateZ(0);
                }
            `}</style>
            <style jsx>{`
                .content-container {
                    color: ${getStyleForTheme(theme)["color"]};
                }
                .content {
                    background-color: ${getStyleForTheme(theme)["backgroundColor"]};
                }
                .scroller:hover::-webkit-scrollbar-thumb {
                    background-color: ${getStyleForTheme(theme)["scrollbarThumbColor"]};
                }
            `}</style>
        </>
    )
}
