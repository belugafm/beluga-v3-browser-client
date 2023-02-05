import React, { useState } from "react"
import { ThemeT } from "../theme"
import classnames from "classnames"
import { TrustLevel, TrustRank } from "../../api/trust_rank"
import { UserObjectT } from "../../api/object"
import { MessagePropsT } from "../desktop/chat/message/types"
import { MessageAvatarComponent } from "../desktop/chat/message/avatar"
import { DateComponent, SenderComponent } from "../desktop/chat/message/sender"
import { LikesComponent } from "../desktop/chat/message/likes"
import { FavoritesComponent } from "../desktop/chat/message/favorites"

const getStyle = (theme: ThemeT) => {
    if (theme.global.current.light) {
        return {
            backgroundColor: "transparent",
        }
    }
    if (theme.global.current.dark) {
        return {
            backgroundColor: "transparent",
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
                `}</style>
            </div>
        )
    },
    (prevProps: MessagePropsT, nextProps: MessagePropsT) => {
        // TODO: データの変化だけを見ているとreducerなどの変更が無視されるため、
        // データとハンドラを分離しキャッシュすべきところとそうでないところをちゃんと管理する
        return false
    }
)
