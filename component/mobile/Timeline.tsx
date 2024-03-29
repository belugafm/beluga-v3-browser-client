import React, { useContext, useMemo, useRef } from "react"
import { ThemeT, useTheme } from "../Theme"

import { ContentActionContext, ContentActionT } from "../../state/chat/actions/contents"
import { ContentStateT, TimelineMode } from "../../state/chat/store/types/app_state"
import { DeleteMessageModalActionContext } from "../../state/component/model/delete_message"
import { DomainDataContext } from "../../state/chat/store/domain_data"
import { MessageActionContext } from "../../state/chat/actions/message"
import { ChannelId, MessageObjectT, UserId } from "../../api/object"
import { ScrollerState } from "../../state/chat/components/scroller"
import { TooltipActionContext } from "../../state/component/tooltip"
import { swrGetLoggedInUser } from "../../swr/session"
import { unnormalizeMessage } from "../../state/chat/store/domain_data/unnormalize"
import { ContentType } from "../../state/chat/store/types/app_state"
import { MessageComponent } from "../mobile/Message"
import { TextComponent } from "../desktop/chat/message/Text"

export class CheckConsecutivePost {
    private lastUserId: UserId | null
    private lastChannelId: ChannelId | null
    private lastCreatedAt: Date | null
    private consectivePeriodInSec: number
    constructor() {
        this.lastUserId = null
        this.lastChannelId = null
        this.lastCreatedAt = null
        this.consectivePeriodInSec = 300
    }
    check(message: MessageObjectT): boolean {
        try {
            if (this.lastUserId == null) {
                throw new Error()
            }
            if (this.lastChannelId != message.channel_id) {
                throw new Error()
            }
            if (this.lastUserId != message.user_id) {
                throw new Error()
            }
            if (
                message.created_at.getTime() - this.lastCreatedAt.getTime() >
                1000 * this.consectivePeriodInSec
            ) {
                throw new Error()
            }
            if (
                message.created_at.getFullYear() != this.lastCreatedAt.getFullYear() ||
                message.created_at.getMonth() != this.lastCreatedAt.getMonth() ||
                message.created_at.getDate() != this.lastCreatedAt.getDate()
            ) {
                throw new Error()
            }
            this.lastUserId = message.user_id
            this.lastChannelId = message.channel_id
            this.lastCreatedAt = message.created_at
            return true
        } catch (error) {
            this.lastUserId = message.user_id
            this.lastChannelId = message.channel_id
            this.lastCreatedAt = message.created_at
            return false
        }
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

const NewMessageNotificationButton = ({
    scrollerState,
    theme,
}: {
    scrollerState: ScrollerState
    theme: ThemeT
}) => {
    if (scrollerState.shouldNotifyNewMessages) {
        const getStyle = (theme: ThemeT) => {
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

const ShowLatestMessagesButton = ({
    scrollerState,
    content,
    theme,
    contentAction,
}: {
    scrollerState: ScrollerState
    content: ContentStateT
    theme: ThemeT
    contentAction: ContentActionT
}) => {
    if (content.timeline.mode == TimelineMode.ShowContextMessages) {
        const getStyle = (theme: ThemeT) => {
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
                            contentAction.showLatestMessages(content)
                            scrollerState.scrollToBottom()
                        }}>
                        <svg className="icon">
                            <use href="#icon-chat-notification"></use>
                        </svg>
                        <span>最新のメッセージを表示</span>
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

const DateDividerComponent = ({ date, theme }: { date: Date; theme: ThemeT }) => {
    const getStyle = (theme: ThemeT) => {
        if (theme.global.current.light) {
            return {
                color: "#1a1d1f",
                borderColor: "#d8dadc",
                backgroundColor: "#ffffff",
            }
        }
        if (theme.global.current.dark) {
            return {
                color: "#fcfcfc",
                borderColor: "#0b0b0b",
                backgroundColor: "#191919",
            }
        }
        throw new Error()
    }
    const text = `${date.getMonth() + 1}月${date.getDate()}日`
    return (
        <div className="divider">
            <span>{text}</span>
            <style jsx>{`
                .divider {
                    flex: 0 0 auto;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    font-size: 12px;
                    border-bottom: solid 1px ${getStyle(theme)["borderColor"]};
                    margin: 0 0 24px 0;
                    transition-duration: 0.2s;
                }
                span {
                    padding: 4px 10px;
                    border-radius: 16px;
                    background-color: ${getStyle(theme)["backgroundColor"]};
                    color: ${getStyle(theme)["color"]};
                    border: 1px solid ${getStyle(theme)["borderColor"]};
                    position: relative;
                    top: 50%;
                    transition-duration: 0.2s;
                }
            `}</style>
        </div>
    )
}

const isEmpty = (content: ContentStateT) => {
    if (content.type == ContentType.Channel) {
        if (content.timeline.messageIds.length == 0) {
            return true
        }
    }
    return false
}

export const TimelineComponent = ({ content }: { content: ContentStateT }) => {
    const domainData = useContext(DomainDataContext)
    const messageAction = useContext(MessageActionContext)
    const contentAction = useContext(ContentActionContext)
    const tooltipAction = useContext(TooltipActionContext)
    const deleteMessageModalAction = useContext(DeleteMessageModalActionContext)
    const { loggedInUser } = swrGetLoggedInUser()
    const scrollerRef = useRef(null)
    const [theme] = useTheme()
    const scrollerState = useMemo(
        () =>
            new ScrollerState({
                reversedColumn: false,
            }),
        [content.id]
    )
    scrollerState.use({
        ref: scrollerRef,
        content: content,
        contentAction: contentAction,
    })
    const consectivePostChecker = new CheckConsecutivePost()
    const messageComponentList = []
    const messageList = [...content.timeline.messageIds].reverse().map((messageId) => {
        const normalizedMessage = domainData.messages.get(messageId)
        if (normalizedMessage == null) {
            return null
        }
        return unnormalizeMessage(normalizedMessage, domainData)
    })
    messageList.forEach((message, n) => {
        if (n > 0) {
            const prevMessage = messageList[n - 1]
            if (
                message.created_at.getFullYear() != prevMessage.created_at.getFullYear() ||
                message.created_at.getMonth() != prevMessage.created_at.getMonth() ||
                message.created_at.getDate() != prevMessage.created_at.getDate()
            ) {
                messageComponentList.push(
                    <DateDividerComponent key={n} date={message.created_at} theme={theme} />
                )
            }
        }
        messageComponentList.push(
            <MessageComponent
                key={message.id}
                message={message}
                messageAction={messageAction}
                contentAction={contentAction}
                tooltipAction={tooltipAction}
                deleteMessageModalAction={deleteMessageModalAction}
                domainData={domainData}
                loggedInUser={loggedInUser}
                content={content}
                isConsecutivePost={consectivePostChecker.check(message)}
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
            <div className="scroller-container">
                <div className="scroller" ref={scrollerRef} onScroll={scrollerState.handleScroll}>
                    <div className="message-container">{messageComponentList}</div>
                </div>
                <NewMessageNotificationButton scrollerState={scrollerState} theme={theme} />
                <ShowLatestMessagesButton
                    scrollerState={scrollerState}
                    content={content}
                    contentAction={contentAction}
                    theme={theme}
                />
            </div>
            <style jsx>{`
                .scroller-container {
                    padding: 0;
                    margin: 0;
                    min-width: 0;
                    min-height: 0;
                    display: flex;
                    flex-direction: column;
                    z-index: 1;
                    position: relative;
                    height: 100dvh;
                    width: 100dvw;
                    flex: 0 1 auto;
                    z-index: 1;
                    overflow-y: scroll;
                    overflow-x: hidden;
                    padding-top: 50px;
                }
                .scroller-container.hidden {
                    visibility: hidden;
                }
                .scroller {
                    flex: 1 1 auto;
                    display: flex;
                    flex-direction: column;
                    overflow-x: hidden;
                    overflow-y: scroll;
                    position: relative;
                    z-index: 1;
                    transform: translateZ(0);
                }
                .message-container {
                    flex: 1 1 auto;
                    display: flex;
                    flex-direction: column;
                }
            `}</style>
        </>
    )
}
