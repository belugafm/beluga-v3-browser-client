import React from "react"
import { ThemeT } from "../../../../theme"

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

export const DateDividerComponent = ({ date, theme }: { date: Date; theme: ThemeT }) => {
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
