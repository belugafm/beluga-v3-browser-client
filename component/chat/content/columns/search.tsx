import React from "react"
import { ThemeT, useTheme } from "../../../theme"

import { ContentStateT } from "../../../../state/chat/store/types/app_state"
import { HeaderComponent } from "../header"
import { TimelineComponent } from "../timeline"

export const getStyle = (theme: ThemeT) => {
    if (theme.global.current.light) {
        return {
            color: "#000",
            backgroundColor: "#fff",
            border: "1px solid rgba(0, 0, 0, 0.08)",
        }
    }
    if (theme.global.current.dark) {
        return {
            color: "#fcfcfc",
            backgroundColor: "rgba(30, 30, 30, 0.98)",
            border: "none",
        }
    }
    throw new Error()
}

export const SearchContentComponent = ({ content }: { content: ContentStateT }) => {
    const [theme] = useTheme()
    return (
        <>
            <div className="content-container">
                <div className="content translucent">
                    <div className="menu">
                        <HeaderComponent content={content} />
                    </div>
                    <TimelineComponent content={content} />
                </div>
            </div>
            <style jsx>{`
                .content-container {
                    flex: 1 1 auto;
                    display: flex;
                    min-height: 300px;
                }
                .content {
                    width: 100%;
                    min-height: 0;
                    display: flex;
                    flex-direction: column;
                    flex: 1 1 auto;
                    box-sizing: border-box;
                    position: relative;
                    overflow: hidden;
                    transition-duration: 0.2s;
                }
                .menu {
                    flex: 0 0 auto;
                    z-index: 3;
                }
                .postbox {
                    flex: 0 0 auto;
                    z-index: 2;
                }
            `}</style>
            <style jsx>{`
                .content-container {
                    color: ${getStyle(theme)["color"]};
                }
                .content {
                    background-color: ${getStyle(theme)["backgroundColor"]};
                }
            `}</style>
        </>
    )
}
