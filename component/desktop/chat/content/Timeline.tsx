import React, { useContext, useMemo, useRef } from "react"
import { ThemeT, useTheme } from "../../../Theme"

import { ContentActionContext } from "../../../../state/chat/actions/contents"
import { ContentStateT } from "../../../../state/chat/store/types/app_state"
import { DeleteMessageModalActionContext } from "../../../../state/component/model/delete_message"
import { DomainDataContext } from "../../../../state/chat/store/domain_data"
import { MessageActionContext } from "../../../../state/chat/actions/message"
import { MessageComponent } from "../message/Message"
import { ChannelId, MessageObjectT, UserId } from "../../../../api/object"
import { ScrollerState } from "../../../../state/chat/components/scroller"
import { TextComponent } from "../message/Text"
import { TooltipActionContext } from "../../../../state/component/tooltip"
import { swrGetLoggedInUser } from "../../../../swr/session"
import { unnormalizeMessage } from "../../../../state/chat/store/domain_data/unnormalize"
import { ContentType } from "../../../../state/chat/store/types/app_state"
import { DateDividerComponent } from "./timeline/DateDivider"
import { EmptyContentComponent } from "./timeline/EmptyContent"
import { SpacerComponent } from "./timeline/Spacer"
import { NewMessageNotificationButton } from "./timeline/NewMessageNotificationButton"
import { ShowLatestMessagesButton } from "./timeline/ShowLatestMessagesButton"

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

const isEmpty = (content: ContentStateT) => {
    if (content.type == ContentType.Channel) {
        if (content.timeline.messageIds.length == 0) {
            return true
        }
    }
    return false
}

export const TimelineComponent = ({ content }: { content: ContentStateT }) => {
    const getStyle = (theme: ThemeT) => {
        if (theme.global.current.light) {
            return {
                scrollbarThumbColor: "#d8dadc",
            }
        }
        if (theme.global.current.dark) {
            return {
                scrollbarThumbColor: "#787878",
            }
        }
        throw new Error()
    }
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
                reversedColumn: true,
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
                    <DateDividerComponent
                        key={message.created_at.toString()}
                        date={message.created_at}
                        theme={theme}
                    />
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
                    flex: 1 1 auto;
                    z-index: 1;
                    position: relative;
                }
                .scroller-container.hidden {
                    visibility: hidden;
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
                    transform: translateZ(0);
                }
                .message-container {
                    flex: 1 1 auto;
                    display: flex;
                    flex-direction: column;
                }
            `}</style>
            <style jsx>{`
                .scroller:hover::-webkit-scrollbar-thumb {
                    background-color: ${getStyle(theme)["scrollbarThumbColor"]};
                }
            `}</style>
        </>
    )
}
