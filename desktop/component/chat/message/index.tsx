import { DateComponent, SenderComponent } from "./sender"

import { CommonPropsT } from "./types"
import { MenuComponent } from "./menu"
import React from "react"
import { Themes } from "../../theme"
import classNames from "classnames"
import deepEqual from "deep-equal"

const getStyle = (theme: Themes) => {
    if (theme.global.current.light) {
        return {
            backgroundColor: "transparent",
            hoverBackgroundColor: "#f4f4f4",
        }
    }
    if (theme.global.current.dark) {
        return {
            backgroundColor: "transparent",
            hoverBackgroundColor: "#111315",
        }
    }
    throw new Error()
}

export const MessageComponent = React.memo(
    (props: CommonPropsT & { zIndex: number; children: any }) => {
        console.info("MessageComponent::render", props.message.id)
        const { message } = props
        if (message.deleted) {
            return null
        }
        return (
            <div
                className={classNames("message", {
                    consecutive: props.isConsecutivePost,
                })}>
                <div className="inner">
                    <div className="message-left">
                        <div
                            className={classNames("avatar-block", {
                                hidden: props.isConsecutivePost,
                            })}>
                            <div className="avatar"></div>
                        </div>
                        <div
                            className={classNames("created-at-block", {
                                hidden: !props.isConsecutivePost,
                            })}>
                            <DateComponent date={message.created_at} />
                        </div>
                    </div>
                    <div className="message-right">
                        <SenderComponent
                            message={message}
                            hidden={props.isConsecutivePost}
                            theme={props.theme}
                        />
                        <div className="text">{props.children}</div>
                    </div>
                </div>
                <div className="menu-container">
                    <MenuComponent
                        message={message}
                        messageAction={props.messageAction}
                        tooltipAction={props.tooltipAction}
                        deleteMessageModalAction={props.deleteMessageModalAction}
                        theme={props.theme}
                    />
                </div>
                <style jsx>{`
                    .message {
                        flex: 0 0 auto;
                        min-height: 24px;
                        cursor: pointer;
                        padding: 4px 0;
                        margin-top: 4px;
                        position: relative;
                        font-size: 15px;
                    }
                    .message.consecutive {
                        margin-top: 0;
                    }
                    .inner {
                        display: flex;
                        flex-direction: row;
                        padding: 0 16px;
                    }
                    .avatar-block.hidden {
                        display: none;
                    }
                    .created-at-block {
                        visibility: hidden;
                        text-align: right;
                        font-size: 13px;
                        font-weight: 300;
                        margin-top: 3px;
                    }
                    .message:hover .created-at-block {
                        visibility: visible;
                    }
                    .created-at-block.hidden {
                        display: none;
                    }
                    .message-left {
                        width: 45px;
                        flex: 0 0 auto;
                    }
                    .message-right {
                        margin-left: 12px;
                        flex: 1 1 auto;
                        min-width: 0;
                    }
                    .avatar {
                        width: 45px;
                        height: 45px;
                        background-color: #546de5;
                        mask: url('data:image/svg+xml;utf8,<svg preserveAspectRatio="none" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M 0, 100 C 0, 23 23, 0 100, 0 S 200, 23 200, 100 177, 200 100, 200 0, 177 0, 100" fill="white"></path></svg>');
                        mask-size: 100% 100%;
                        -webkit-mask-image: url('data:image/svg+xml;utf8,<svg preserveAspectRatio="none" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M 0, 100 C 0, 23 23, 0 100, 0 S 200, 23 200, 100 177, 200 100, 200 0, 177 0, 100" fill="white"></path></svg>');
                        border-radius: 0;
                        margin-top: 2px;
                    }
                    .text {
                        word-break: break-all;
                        margin-top: 2px;
                    }
                    .message.consecutive .text {
                        margin-top: 0;
                    }
                    .menu-container {
                        display: none;
                        position: absolute;
                        top: -16px;
                        right: 8px;
                    }
                    .message:hover > .menu-container {
                        display: block;
                    }
                `}</style>
                <style jsx>{`
                    .message {
                        background-color: ${getStyle(props.theme)["backgroundColor"]};
                        z-index: ${props.zIndex};
                    }
                    .message:hover {
                        background-color: ${getStyle(props.theme)["hoverBackgroundColor"]};
                    }
                `}</style>
            </div>
        )
    },
    (prevProps: CommonPropsT, nextProps: CommonPropsT) => {
        if (prevProps.message.updated_at !== nextProps.message.updated_at) {
            return false
        }
        if (prevProps.message.deleted !== nextProps.message.deleted) {
            return false
        }
        // const prevUser = prevProps.domainData.users.get(prevProps.message.user_id)
        // const nextUser = nextProps.domainData.users.get(nextProps.message.user_id)
        // if (prevUser.last_activity_time !== nextUser.last_activity_time) {
        //     return false
        // }
        if (prevProps.domainData.mutedUserIds.equals(nextProps.domainData.mutedUserIds) === false) {
            return false
        }
        if (
            prevProps.domainData.blockedUserIds.equals(nextProps.domainData.blockedUserIds) ===
            false
        ) {
            return false
        }
        if (prevProps.message.text !== nextProps.message.text) {
            return false
        }
        if (prevProps.content) {
            if (
                prevProps.content.options.showMutedMessage !==
                nextProps.content.options.showMutedMessage
            ) {
                return false
            }
        }
        if (deepEqual(prevProps.theme.global.current, nextProps.theme.global.current) == false) {
            return false
        }
        return true
    }
)
