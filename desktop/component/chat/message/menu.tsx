import { MessageActionT } from "../../../state/chat/components/message"
import { MessageObjectT } from "../../../api/object"
import React from "react"
import { Themes } from "../../theme"
import { TooltipActionT } from "../../../state/component/tooltip"

const getStyleForButton = (theme: Themes) => {
    if (theme.global.current.light) {
        return {
            fill: "#595e64",
            hoverFill: "#1a1d1f",
            backgroundColor: "transparent",
            hoverBackgroundColor: "#f4f4f4",
        }
    }
    if (theme.global.current.dark) {
        return {
            fill: "#899096",
            hoverFill: "#fcfcfc",
            backgroundColor: "#15171a",
            hoverBackgroundColor: "#1f2327",
        }
    }
    throw new Error()
}

const getStyleForMenu = (theme: Themes) => {
    if (theme.global.current.light) {
        return {
            borderColor: "#d8dadc",
            backgroundColor: "#fff",
        }
    }
    if (theme.global.current.dark) {
        return {
            borderColor: "#080a0b",
            backgroundColor: "#15171a",
        }
    }
    throw new Error()
}

export const MenuComponent = ({
    message,
    theme,
    messageAction,
    tooltipAction,
}: {
    message: MessageObjectT
    theme: Themes
    messageAction: MessageActionT
    tooltipAction: TooltipActionT
}) => {
    return (
        <div className="menu">
            <button
                className="add-reaction global-tooltip-container"
                onMouseEnter={(e) => tooltipAction.show(e, "リアクションする")}
                onMouseLeave={() => tooltipAction.hide()}>
                <svg className="icon">
                    <use href="#icon-editor-emoji"></use>
                </svg>
            </button>
            <button
                className="create-like global-tooltip-container"
                onMouseEnter={(e) => tooltipAction.show(e, "いいね")}
                onMouseLeave={() => tooltipAction.hide()}>
                <svg className="icon">
                    <use href="#icon-star-outline"></use>
                </svg>
            </button>
            <button
                className="create-favorite global-tooltip-container"
                onMouseEnter={(e) => tooltipAction.show(e, "ふぁぼ")}
                onMouseLeave={() => tooltipAction.hide()}>
                <svg className="icon">
                    <use href="#icon-heart-outline"></use>
                </svg>
            </button>
            <button
                className="reply-in-thread global-tooltip-container"
                onMouseEnter={(e) => tooltipAction.show(e, "スレッドで返信する")}
                onMouseLeave={() => tooltipAction.hide()}>
                <svg className="icon">
                    <use href="#icon-chat"></use>
                </svg>
            </button>
            <button
                className="share global-tooltip-container"
                onMouseEnter={(e) => tooltipAction.show(e, "共有する")}
                onMouseLeave={() => tooltipAction.hide()}>
                <svg className="icon">
                    <use href="#icon-share-message"></use>
                </svg>
            </button>
            <button
                className="delete global-tooltip-container"
                onClick={messageAction.delete(message)}
                onMouseEnter={(e) => tooltipAction.show(e, "削除する")}
                onMouseLeave={() => tooltipAction.hide()}>
                <svg className="icon">
                    <use href="#icon-trash"></use>
                </svg>
            </button>
            <style jsx>{`
                .menu {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    border: 1px solid transparent;
                    border-radius: 8px;
                    padding: 2px;
                }
                button {
                    position: relative;
                    cursor: pointer;
                    width: 32px;
                    height: 32px;
                    border-radius: 5px;
                    outline: none;
                    border: none;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: center;
                    background-color: transparent;
                    transition: 0.05s;
                    margin-right: 2px;
                }
                button > .icon {
                    width: 18px;
                    height: 18px;
                    text-align: center;
                    flex-shrink: 0;
                }
            `}</style>
            <style jsx>{`
                .menu {
                    background-color: ${getStyleForMenu(theme)["backgroundColor"]};
                    border-color: ${getStyleForMenu(theme)["borderColor"]};
                }
                button {
                    fill: ${getStyleForButton(theme)["fill"]};
                    background-color: ${getStyleForButton(theme)["backgroundColor"]};
                }
                button:hover {
                    fill: ${getStyleForButton(theme)["hoverFill"]};
                    background-color: ${getStyleForButton(theme)["hoverBackgroundColor"]};
                }
            `}</style>
        </div>
    )
}
