import { MessageObjectT } from "../../../api/object"
import React from "react"
import { Themes } from "../../theme"
import classnames from "classnames"

const getStyle = (theme: Themes) => {
    if (theme.global.current.light) {
        return {
            fill: "#fec52e",
        }
    }
    if (theme.global.current.dark) {
        return {
            fill: "#fec52e",
        }
    }
    throw new Error()
}

export const LikesComponent = ({ message, theme }: { message: MessageObjectT; theme: Themes }) => {
    if (message.like_count == 0) {
        return null
    }
    const stars = []
    for (let k = 0; k < message.like_count; k++) {
        stars.push(
            <span key={k}>
                <svg className="icon">
                    <use href="#icon-star"></use>
                </svg>
                <style jsx>{`
                    span {
                        flex: 0 0 auto;
                        display: flex;
                        margin-right: 1px;
                    }
                    .icon {
                        width: 15px;
                        height: 15px;
                    }
                    .icon {
                        fill: ${getStyle(theme)["fill"]};
                    }
                `}</style>
            </span>
        )
    }
    return (
        <div className="likes">
            {stars}
            <style jsx>{`
                .likes {
                    display: flex;
                    flex-direction: row;
                    margin: 4px 0;
                }
            `}</style>
        </div>
    )
}
