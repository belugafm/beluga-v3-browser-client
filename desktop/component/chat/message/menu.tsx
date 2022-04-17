import { MessageActionT } from "../../../state/chat/components/message"
import { MessageObjectT } from "../../../api/object"
import React from "react"
import { Themes } from "../../theme"
import { TooltipActionT } from "../../../state/component/tooltip"

const getStyleForButton = (theme: Themes) => {
    if (theme.global.current.light) {
        return {
            fill: "#6f767d",
            hoverFill: "#1a1d1f",
            backgroundColor: "transparent",
            hoverBackgroundColor: "#f4f4f4",
        }
    }
    if (theme.global.current.dark) {
        return {
            fill: "#616d78",
            hoverFill: "#fcfcfc",
            backgroundColor: "#111315",
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
            backgroundColor: "#111315",
        }
    }
    throw new Error()
}

export const MenuComponent = ({
    message,
    theme,
    messageActions,
    tooltipActions,
}: {
    message: MessageObjectT
    theme: Themes
    messageActions: MessageActionT
    tooltipActions: TooltipActionT
}) => {
    return (
        <div className="menu">
            <button
                className="add-reaction global-tooltip-container"
                onMouseEnter={(e) => tooltipActions.show(e, "リアクションする")}
                onMouseLeave={(e) => tooltipActions.hide()}>
                <svg className="icon">
                    <use href="#icon-editor-emoji"></use>
                </svg>
            </button>
            <button
                className="create-like global-tooltip-container"
                onMouseEnter={(e) => tooltipActions.show(e, "いいね")}
                onMouseLeave={(e) => tooltipActions.hide()}>
                <svg className="icon">
                    <use href="#icon-star-outline"></use>
                </svg>
            </button>
            <button
                className="create-favorite global-tooltip-container"
                onMouseEnter={(e) => tooltipActions.show(e, "ふぁぼ")}
                onMouseLeave={(e) => tooltipActions.hide()}>
                <svg className="icon">
                    <use href="#icon-heart-outline"></use>
                </svg>
            </button>
            <button
                className="reply-in-thread global-tooltip-container"
                onMouseEnter={(e) => tooltipActions.show(e, "スレッドで返信する")}
                onMouseLeave={(e) => tooltipActions.hide()}>
                <svg className="icon">
                    <use href="#icon-chat"></use>
                </svg>
            </button>
            <button
                className="share global-tooltip-container"
                onMouseEnter={(e) => tooltipActions.show(e, "共有する")}
                onMouseLeave={(e) => tooltipActions.hide()}>
                <svg className="icon">
                    <use href="#icon-share-message"></use>
                </svg>
            </button>
            <button
                className="delete global-tooltip-container"
                onMouseEnter={(e) => tooltipActions.show(e, "削除する")}
                onMouseLeave={(e) => tooltipActions.hide()}>
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
