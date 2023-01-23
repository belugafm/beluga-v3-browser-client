import React from "react"
import { ThemeT, useTheme } from "../theme"

export const getStyle = (theme: ThemeT) => {
    if (theme.global.current.light) {
        return {
            color: "#000",
            backgroundColor: "#fff",
        }
    }
    if (theme.global.current.dark) {
        return {
            color: "#fcfcfc",
            backgroundColor: "rgba(30, 30, 30, 0.98)",
        }
    }
    throw new Error()
}

export const ContentComponent = ({ children }) => {
    const [theme] = useTheme()
    return (
        <>
            <div className="content-container translucent">
                <div className="content">{children}</div>
            </div>
            <style jsx>{`
                .content-container {
                    flex: 0 1 700px;
                    display: flex;
                    flex-direction: column;
                    z-index: 1;
                    border-radius: 0 12px 12px 0;
                    padding: 16px;
                    box-sizing: border-box;
                    color: ${getStyle(theme)["color"]};
                    background-color: ${getStyle(theme)["backgroundColor"]};
                }
                .content {
                    flex: 1 1 auto;
                    min-height: 0;
                    display: flex;
                    flex-direction: column;
                    padding: 16px;
                    box-sizing: border-box;
                    overflow-y: hidden;
                    overflow-x: scroll;
                }
                .content::-webkit-scrollbar {
                    width: 0px;
                    height: 0px;
                }
                .content::-webkit-scrollbar-thumb {
                    border-radius: 10px;
                    background-color: gray;
                }
                .content::-webkit-scrollbar-track-piece {
                    background-clip: padding-box;
                    background-color: transparent;
                    border-color: transparent;
                }
                .empty-column {
                    flex: 1 1 auto;
                }
            `}</style>
        </>
    )
}
