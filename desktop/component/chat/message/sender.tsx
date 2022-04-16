import { MessageObjectT } from "../../../api/object"
import React from "react"
import { Themes } from "../../theme"
import classNames from "classnames"

const getStyle = (theme: Themes) => {
    if (theme.global.current.light) {
        return {
            color: "#000",
        }
    }
    if (theme.global.current.dark) {
        return {
            color: "#fff",
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
    theme: Themes
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
                className={classNames("display-name", {
                    hidden: user.display_name == null,
                })}
                href={`/user/${user.name}`}>
                {display_name}
            </a>
            <a className="name" href={`/user/${user.name}`}>
                {`@${user.name}`}
            </a>
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
                    margin-right: 4px;
                    flex: 0 1 auto;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }
                .time {
                    font-size: 13px;
                    font-weight: 300;
                }
            `}</style>
            <style jsx>{`
                a {
                    color: ${getStyle(theme)["color"]};
                }
            `}</style>
        </div>
    )
}
