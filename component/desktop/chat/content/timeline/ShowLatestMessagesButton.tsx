import React from "react"
import { ThemeT } from "../../../../theme"

import { ContentStateT, TimelineMode } from "../../../../../state/chat/store/types/app_state"
import { ScrollerState } from "../../../../../state/chat/components/scroller"
import { ContentActionT } from "../../../../../state/chat/actions/contents"

const getStyle = (theme: ThemeT) => {
    if (theme.global.current.light) {
        return {
            fill: "#fff",
            hoverFill: "#fff",
            backgroundColor: "#2a85ff",
            hoverBackgroundColor: "#0069f6",
            focusBackgroundColor: "#2a85ff",
        }
    }
    if (theme.global.current.dark) {
        return {
            fill: "#fff",
            hoverFill: "#fff",
            backgroundColor: "#2a85ff",
            hoverBackgroundColor: "#0069f6",
            focusBackgroundColor: "#2a85ff",
        }
    }
    throw new Error()
}

export const ShowLatestMessagesButton = ({
    scrollerState,
    content,
    theme,
    contentAction,
}: {
    scrollerState: ScrollerState
    content: ContentStateT
    theme: ThemeT
    contentAction: ContentActionT
}) => {
    if (content.timeline.mode == TimelineMode.ShowContextMessages) {
        return (
            <>
                <div className="container">
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            contentAction.showLatestMessages(content)
                            scrollerState.scrollToBottom()
                        }}>
                        <svg className="icon">
                            <use href="#icon-chat-notification"></use>
                        </svg>
                        <span>最新のメッセージを表示</span>
                    </button>
                </div>
                <style jsx>{`
                    .container {
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        z-index: 2;
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: center;
                    }
                    .icon {
                        width: 18px;
                        height: 18px;
                        text-align: center;
                        flex-shrink: 0;
                        margin: 1px 4px 0 0;
                    }
                    button {
                        cursor: pointer;
                        height: 32px;
                        border-radius: 18px;
                        outline: none;
                        border: none;
                        background-color: transparent;
                        transition: 0.1s;
                        font-weight: 500;
                        padding: 0 20px;
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: center;
                        font-size: 14px;
                        line-height: 32px;
                    }
                `}</style>
                <style jsx>{`
                    button {
                        color: ${getStyle(theme)["fill"]};
                        background-color: ${getStyle(theme)["backgroundColor"]};
                    }
                    button:hover {
                        background-color: ${getStyle(theme)["hoverBackgroundColor"]};
                    }
                    .icon {
                        fill: ${getStyle(theme)["fill"]};
                    }
                `}</style>
            </>
        )
    }
    return null
}
