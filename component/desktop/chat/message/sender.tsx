import { MessageObjectT } from "../../../../api/object"
import React from "react"
import { ThemeT } from "../../../theme"
import classnames from "classnames"

const getStyle = (theme: ThemeT) => {
    if (theme.global.current.light) {
        return {
            color: "#000",
            color2: "#6f767d",
        }
    }
    if (theme.global.current.dark) {
        return {
            color: "#fff",
            color2: "#6f767d",
        }
    }
    throw new Error()
}

const formatWithTwoDecimals = (n: number) => {
    if (n < 10) {
        return `0${n}`
    }
    return n
}

const BotIndicator = ({ isBot, theme }: { isBot: boolean; theme: ThemeT }) => {
    const getStyle = (theme: ThemeT) => {
        if (theme.global.current.light) {
            return {
                color: "#fff",
                bgColor: "#999",
            }
        }
        if (theme.global.current.dark) {
            return {
                color: "#000",
                bgColor: "#999",
            }
        }
        throw new Error()
    }
    if (isBot) {
        return (
            <span className="is-bot">
                BOT
                <style jsx>{`
                    .is-bot {
                        background-color: ${getStyle(theme)["bgColor"]};
                        color: ${getStyle(theme)["color"]};
                        font-size: 10px;
                        border-radius: 4px;
                        padding: 1px 4px;
                        font-weight: bold;
                        margin-left: 4px;
                        margin-right: 8px;
                    }
                `}</style>
            </span>
        )
    }
    return null
}

export const DateComponent = ({ date }: { date: Date }) => {
    const hours = formatWithTwoDecimals(date.getHours())
    const minutes = formatWithTwoDecimals(date.getMinutes())
    const str = `${hours}:${minutes}`
    return <span>{str}</span>
}

export const SenderComponent = ({
    message,
    theme,
    hidden,
}: {
    message: MessageObjectT
    theme: ThemeT
    hidden: boolean
}) => {
    if (hidden) {
        return null
    }
    const user = message.user
    const display_name = user.display_name ? user.display_name : user.name
    return (
        <div className="sender">
            <a
                className={classnames("display-name", {
                    hidden: user.display_name == null,
                })}
                href={`/user/${user.name}`}>
                {display_name}
            </a>
            <a className="name" href={`/user/${user.name}`}>
                <span className="at-str">@</span>
                <span className="name-str">{user.name}</span>
            </a>
            <BotIndicator isBot={user.bot} theme={theme} />
            <span className="time">
                <DateComponent date={message.created_at} />
            </span>
            <style jsx>{`
                .sender {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    white-space: nowrap;
                    overflow: hidden;
                    min-width: 0;
                }
                a {
                    text-decoration: none;
                    font-weight: normal;
                    transition-duration: 0.2s;
                    transition-property: color;
                }
                a:hover {
                    text-decoration: underline;
                }
                .display-name {
                    font-weight: 500;
                    margin-right: 4px;
                    flex: 0 1 auto;
                }
                .display-name.hidden {
                    display: none;
                }
                .name {
                    font-weight: 300;
                    font-size: 13px;
                    margin-right: 4px;
                    flex: 0 1 auto;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    line-height: 15px;
                    height: 17px;
                }
                .at-str {
                    font-size: 15px;
                    margin-right: 1px;
                }
                .time {
                    font-size: 13px;
                    font-weight: 300;
                }
            `}</style>
            <style jsx>{`
                .display-name {
                    color: ${getStyle(theme)["color"]};
                }
                .name {
                    color: ${getStyle(theme)["color2"]};
                }
                .time {
                    color: ${getStyle(theme)["color2"]};
                }
            `}</style>
        </div>
    )
}
