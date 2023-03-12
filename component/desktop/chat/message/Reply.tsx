import { MessageObjectT, UserObjectT } from "../../../../api/object"
import React from "react"
import { ThemeT } from "../../../Theme"
import classnames from "classnames"
import { ContentActionT } from "../../../../state/chat/actions/contents"
import { Random } from "./ProfileImage"
import { ContentStateT } from "../../../../state/chat/store/types/app_state"

const getStyle = (theme: ThemeT) => {
    if (theme.global.current.light) {
        return {
            primaryColor: "#0D0D0D",
            secondaryColor: "#808080",
            backgroundColor: "#F7F7F7",
            hoverBgColor: "#FFFFFF",
            borderColor: "#D9D9D9",
            stroke: "#0D0D0D",
        }
    }
    if (theme.global.current.dark) {
        return {
            primaryColor: "#dddddd",
            secondaryColor: "#919191",
            backgroundColor: "#141414",
            hoverBgColor: "#1f1f1f",
            borderColor: "transparent",
            stroke: "#dddddd",
        }
    }
    throw new Error()
}

const RandomColorComponent = ({ user }: { user: UserObjectT }) => {
    const gen = new Random(user.id)
    const hue = 360 * gen.next()
    const sat = 50
    const lightness = 70
    return (
        <>
            <div className="avatar"></div>
            <style jsx>{`
                .avatar {
                    flex: 0 0 auto;
                    width: 22px;
                    height: 22px;
                    mask: url('data:image/svg+xml;utf8,<svg preserveAspectRatio="none" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M 0, 100 C 0, 23 23, 0 100, 0 S 200, 23 200, 100 177, 200 100, 200 0, 177 0, 100" fill="white"></path></svg>');
                    mask-size: 100% 100%;
                    -webkit-mask-image: url('data:image/svg+xml;utf8,<svg preserveAspectRatio="none" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M 0, 100 C 0, 23 23, 0 100, 0 S 200, 23 200, 100 177, 200 100, 200 0, 177 0, 100" fill="white"></path></svg>');
                    border-radius: 0;
                    margin: 0 8px;
                }
            `}</style>
            <style jsx>{`
                .avatar {
                    background-color: hsl(${hue}deg, ${sat}%, ${lightness}%);
                }
            `}</style>
        </>
    )
}

const ImageComponent = ({ user }: { user: UserObjectT }) => {
    return (
        <>
            <div className="avatar">
                <img src={user.profile_image_url} />
            </div>
            <style jsx>{`
                .avatar {
                    flex: 0 0 auto;
                    width: 22px;
                    height: 22px;
                    mask: url('data:image/svg+xml;utf8,<svg preserveAspectRatio="none" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M 0, 100 C 0, 23 23, 0 100, 0 S 200, 23 200, 100 177, 200 100, 200 0, 177 0, 100" fill="white"></path></svg>');
                    mask-size: 100% 100%;
                    -webkit-mask-image: url('data:image/svg+xml;utf8,<svg preserveAspectRatio="none" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M 0, 100 C 0, 23 23, 0 100, 0 S 200, 23 200, 100 177, 200 100, 200 0, 177 0, 100" fill="white"></path></svg>');
                    border-radius: 0;
                    margin: 0 8px;
                }
                img {
                    width: 22px;
                    height: 22px;
                }
            `}</style>
        </>
    )
}

const ProfileImageComponent = ({ user }: { user: UserObjectT }) => {
    if (user.profile_image_url == null) {
        return <RandomColorComponent user={user} />
    }
    return <ImageComponent user={user} />
}

export const ReplyComponent = ({
    message,
    theme,
    content,
    contentAction,
}: {
    message: MessageObjectT
    theme: ThemeT
    content: ContentStateT
    contentAction: ContentActionT
}) => {
    if (message.reply_count == 0) {
        return null
    }
    return (
        <div className="reply">
            <a
                href="/"
                onClick={(e) => {
                    e.preventDefault()
                    contentAction.openThread(message, content.id)
                }}>
                <ProfileImageComponent user={message.last_reply_message.user} />
                <span className="text">{message.last_reply_message.text}</span>
                <span className="count">{message.reply_count}件の返信</span>
                <svg>
                    <use href="#icon-direction-right"></use>
                </svg>
            </a>
            <style jsx>{`
                .reply {
                    margin: 8px 0 4px 0;
                }
                a {
                    display: flex;
                    flex-direction: row;
                    height: 34px;
                    align-items: center;
                    border-radius: 8px;
                    font-size: 13px;
                    line-height: 1em;
                    text-decoration: none;
                    background-color: ${getStyle(theme)["backgroundColor"]};
                    border: 1px solid ${getStyle(theme)["borderColor"]};
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                svg {
                    flex: 0 0 auto;
                    width: 22px;
                    height: 22px;
                    padding: 0 6px;
                    stroke: ${getStyle(theme)["stroke"]};
                }
                .text {
                    flex: 1 1 auto;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    color: ${getStyle(theme)["primaryColor"]};
                }
                .count {
                    font-size: 12px;
                    flex: 0 0 auto;
                    color: ${getStyle(theme)["secondaryColor"]};
                    margin-left: 6px;
                }
                a:hover {
                    background-color: ${getStyle(theme)["hoverBgColor"]};
                }
            `}</style>
        </div>
    )
}
