import { DateComponent, SenderComponent } from "./sender"

import { MessagePropsT } from "./types"
import { MenuComponent } from "./menu"
import { MessageAvatarComponent } from "./avatar"
import React, { useState } from "react"
import { ThemeT } from "../../../theme"
import classnames from "classnames"
import deepEqual from "deep-equal"
import { LikesComponent } from "./likes"
import { FavoritesComponent } from "./favorites"
import { TrustLevel, TrustRank } from "../../../../api/trust_rank"
import { UserObjectT } from "../../../../api/object"

const lerp = (a: number, b: number, ratio: number) => {
    return a * (1 - ratio) + b * ratio
}

const rlerp = (a: number, b: number, ratio: number) => {
    return (b - a * (1 - ratio)) / ratio
}

const getStyle = (theme: ThemeT) => {
    if (theme.global.current.light) {
        return {
            backgroundColor: "transparent",
            hoverBackgroundColor: "#f4f4f4",
        }
    }
    if (theme.global.current.dark) {
        return {
            backgroundColor: "transparent",
            hoverBackgroundColor: "#0f0f0f",
        }
    }
    throw new Error()
}

const TextComponent = ({
    children,
    messageUser,
    loggedInUser,
    theme,
}: {
    children: any
    messageUser: UserObjectT
    loggedInUser: UserObjectT
    theme: ThemeT
}) => {
    const getStyle = (theme: ThemeT) => {
        if (theme.global.current.light) {
            return {
                color: "#828282",
                linkColor: "#323232",
            }
        }
        if (theme.global.current.dark) {
            return {
                color: "#a0a0a0",
                linkColor: "#ffffff",
            }
        }
        throw new Error()
    }
    // 不審ユーザーの投稿はデフォルトで表示しない
    // クリックすれば表示されるようにする
    const [showText, setShowText] = useState(
        loggedInUser
            ? messageUser.id == loggedInUser.id
                ? true
                : messageUser.trust_level == TrustLevel[TrustRank.RiskyUser]
                ? false
                : true
            : messageUser.trust_level == TrustLevel[TrustRank.RiskyUser]
            ? false
            : true
    )
    if (showText) {
        return children
    }
    return (
        <>
            <div>
                <span>信用レベルが低いユーザーの投稿を非表示にしています</span>
                <a
                    onClick={(e) => {
                        e.preventDefault()
                        setShowText(true)
                    }}>
                    表示する
                </a>
            </div>
            <style jsx>{`
                span {
                    font-style: italic;
                    font-size: 14px;
                    color: ${getStyle(theme)["color"]};
                }
                a {
                    font-style: italic;
                    font-size: 14px;
                    text-decoration: none;
                    cursor: pointer;
                    color: ${getStyle(theme)["linkColor"]};
                    margin-left: 14px;
                }
            `}</style>
        </>
    )
}

export const MessageComponent = React.memo(
    (props: MessagePropsT & { children: any }) => {
        console.debug("[MessageComponent] render", props.message.id)
        const [zIndex, setZIndex] = useState(0)
        const bringDomToFront = (on: boolean) => {
            if (on) {
                setZIndex(1)
            } else {
                setZIndex(0)
            }
        }
        const { message } = props
        if (message.deleted) {
            return null
        }
        const user = props.domainData.users.get(message.user_id)
        if (user == null) {
            return null
        }
        return (
            <div
                className={classnames("message", {
                    consecutive: props.isConsecutivePost,
                })}
                style={{
                    zIndex,
                }}>
                <div className="inner">
                    <div className="message-left">
                        <div
                            className={classnames("avatar-block", {
                                hidden: props.isConsecutivePost,
                            })}>
                            <MessageAvatarComponent user={message.user} />
                        </div>
                        <div
                            className={classnames("created-at-block", {
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
                        <div className="text">
                            <TextComponent
                                children={props.children}
                                messageUser={user}
                                loggedInUser={props.loggedInUser}
                                theme={props.theme}
                            />
                        </div>
                        <LikesComponent message={message} theme={props.theme} />
                        <FavoritesComponent message={message} theme={props.theme} />
                    </div>
                </div>
                <div className="menu-container">
                    <MenuComponent
                        message={message}
                        content={props.content}
                        contentAction={props.contentAction}
                        messageAction={props.messageAction}
                        tooltipAction={props.tooltipAction}
                        deleteMessageModalAction={props.deleteMessageModalAction}
                        theme={props.theme}
                        bringMessageDomToFront={bringDomToFront}
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
                        z-index: 0;
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
                        opacity: 0;
                        text-align: right;
                        font-size: 13px;
                        font-weight: 300;
                        margin-top: 3px;
                    }
                    .message:hover .created-at-block {
                        opacity: 1;
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
                    .consecutive.consecutive .menu-container {
                        top: -26px;
                    }
                    .message:hover > .menu-container {
                        display: block;
                    }
                `}</style>
                <style jsx>{`
                    .message {
                        background-color: ${getStyle(props.theme)["backgroundColor"]};
                    }
                    .message:hover {
                        background-color: ${getStyle(props.theme)["hoverBackgroundColor"]};
                    }
                `}</style>
            </div>
        )
    },
    (prevProps: MessagePropsT, nextProps: MessagePropsT) => {
        // TODO: データの変化だけを見ているとreducerなどの変更が無視されるため、
        // データとハンドラを分離しキャッシュすべきところとそうでないところをちゃんと管理する
        return false
        if (prevProps.message._internal_updated_at !== nextProps.message._internal_updated_at) {
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
        if (prevProps.message.like_count !== nextProps.message.like_count) {
            return false
        }
        if (prevProps.message.favorite_count !== nextProps.message.favorite_count) {
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
