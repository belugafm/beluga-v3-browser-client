import { DeleteMessageModalActionT } from "../../../state/component/model/delete_message"
import { MessageActionT } from "../../../state/chat/actions/message"
import { MessageObjectT } from "../../../api/object"
import { useRef, useState } from "react"
import React from "react"
import { Themes } from "../../theme"
import { TooltipActionT } from "../../../state/component/tooltip"
import { ContentActionT } from "../../../state/chat/actions/contents"
import { ContentStateT } from "../../../state/chat/store/types/app_state"
import classnames from "classnames"

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
    content,
    contentAction,
    messageAction,
    tooltipAction,
    deleteMessageModalAction,
    bringMessageDomToFront,
}: {
    message: MessageObjectT
    theme: Themes
    content: ContentStateT
    contentAction: ContentActionT
    messageAction: MessageActionT
    tooltipAction: TooltipActionT
    deleteMessageModalAction: DeleteMessageModalActionT
    bringMessageDomToFront: (on: boolean) => void
}) => {
    const [otherMenuPositionBottom, setOtherMenuPositionBottom] = useState(0)
    const [isOtherMenuVisible, _setIsOtherMenuVisible] = useState(false)
    const setIsOtherMenuVisible = (on: boolean) => {
        _setIsOtherMenuVisible(on)
        if (on) {
            // メニューの項目がクリックできなくなるのを回避
            bringMessageDomToFront(true)
        } else {
            bringMessageDomToFront(false)
        }
    }
    const ref = useRef(null)
    return (
        <div className="menu" ref={ref}>
            <button
                className="menu-button add-reaction global-tooltip-container"
                onMouseEnter={(e) => tooltipAction.show(e, "リアクションする")}
                onMouseLeave={() => tooltipAction.hide()}>
                <svg className="icon">
                    <use href="#icon-editor-emoji"></use>
                </svg>
            </button>
            <button
                className="menu-button create-like global-tooltip-container"
                onMouseEnter={(e) => tooltipAction.show(e, "いいね")}
                onMouseLeave={() => tooltipAction.hide()}>
                <svg className="icon">
                    <use href="#icon-star-outline"></use>
                </svg>
            </button>
            <button
                className="menu-button create-favorite global-tooltip-container"
                onMouseEnter={(e) => tooltipAction.show(e, "ふぁぼ")}
                onMouseLeave={() => tooltipAction.hide()}>
                <svg className="icon">
                    <use href="#icon-heart-outline"></use>
                </svg>
            </button>
            <button
                className="menu-button reply-in-thread global-tooltip-container"
                onMouseEnter={(e) => tooltipAction.show(e, "スレッドで返信する")}
                onMouseLeave={() => tooltipAction.hide()}>
                <svg className="icon">
                    <use href="#icon-chat"></use>
                </svg>
            </button>
            <button
                className="menu-button delete global-tooltip-container"
                onClick={(e) => deleteMessageModalAction.show(message)}
                onMouseEnter={(e) => tooltipAction.show(e, "削除する")}
                onMouseLeave={() => tooltipAction.hide()}>
                <svg className="icon">
                    <use href="#icon-trash"></use>
                </svg>
            </button>
            <button
                className="menu-button delete global-tooltip-container"
                onClick={(e) => {
                    e.preventDefault()
                    if (ref.current) {
                        const messageDom = ref.current.parentNode.parentNode
                        const scrollerDom = messageDom.parentNode
                        const messageRect = messageDom.getBoundingClientRect()
                        const scrollerRect = scrollerDom.getBoundingClientRect()
                        const otherMenuHeight = 333 // display: noneなので高さが取れない
                        const topMargin = messageRect.top - scrollerRect.top
                        const bottomMargin = scrollerRect.bottom - messageRect.top
                        const bottom =
                            Math.min(0, topMargin - otherMenuHeight / 2 + 16) +
                            Math.max(0, otherMenuHeight / 2 - bottomMargin + 24) -
                            otherMenuHeight / 2
                        setOtherMenuPositionBottom(bottom)
                    }
                    setIsOtherMenuVisible(!isOtherMenuVisible)
                }}
                onMouseEnter={(e) => tooltipAction.show(e, "その他")}
                onMouseLeave={() => tooltipAction.hide()}>
                <svg className="icon">
                    <use href="#icon-more-vertical"></use>
                </svg>
            </button>
            <div
                className={classnames("other-menu-container", {
                    visible: isOtherMenuVisible,
                })}
                style={{
                    bottom: `${otherMenuPositionBottom}px`,
                }}
                onMouseLeave={(e) => {
                    setIsOtherMenuVisible(false)
                }}>
                <div className="other-menu">
                    <a className="other-menu-button">
                        <svg className="icon">
                            <use href="#icon-edit-message"></use>
                        </svg>
                        <span>メッセージを編集する</span>
                    </a>
                    <div className="spacer"></div>
                    <a className="other-menu-button">
                        <svg className="icon">
                            <use href="#icon-link"></use>
                        </svg>
                        <span>リンクをコピー</span>
                    </a>
                    <a className="other-menu-button">
                        <svg className="icon">
                            <use href="#icon-show-context"></use>
                        </svg>
                        <span>前後のメッセージを表示</span>
                    </a>
                    <div className="spacer"></div>
                    <a className="other-menu-button">
                        <svg className="icon">
                            <use href="#icon-display-message-on-channel"></use>
                        </svg>
                        <span>固定メッセージに追加</span>
                    </a>
                    <a className="other-menu-button">
                        <svg className="icon">
                            <use href="#icon-pin"></use>
                        </svg>
                        <span>チャンネルにピン留め</span>
                    </a>
                    <div className="spacer"></div>
                    <a className="other-menu-button">
                        <svg className="icon">
                            <use href="#icon-mute-user"></use>
                        </svg>
                        <span>ユーザーをミュート</span>
                    </a>
                    <a className="other-menu-button">
                        <svg className="icon">
                            <use href="#icon-block-user"></use>
                        </svg>
                        <span>ユーザーをブロック</span>
                    </a>
                    <a className="other-menu-button">
                        <svg className="icon">
                            <use href="#icon-report-user"></use>
                        </svg>
                        <span>違反を報告</span>
                    </a>
                </div>
            </div>
            <style jsx>{`
                .menu {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    border: 1px solid transparent;
                    border-radius: 8px;
                    padding: 2px;
                    position: relative;
                    z-index: 0;
                }
                .menu-button {
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
                .menu-button > .icon {
                    width: 18px;
                    height: 18px;
                    text-align: center;
                    flex-shrink: 0;
                }
                .other-menu-container {
                    position: absolute;
                    right: 32px;
                    z-index: 1;
                    display: none;
                }
                .other-menu-container.visible {
                    display: block;
                }
                .other-menu {
                    flex-direction: column;
                    padding: 8px;
                    border: 1px solid transparent;
                    border-radius: 8px;
                }
                .other-menu-button {
                    width: 200px;
                    background-color: transparent;
                    text-decoration: none;
                    outline: none;
                    padding: 6px 12px;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    border-radius: 5px;
                }
                .other-menu-button > .icon {
                    width: 18px;
                    height: 18px;
                    text-align: center;
                    flex-shrink: 0;
                    margin-right: 10px;
                }
                .spacer {
                    border-bottom: 1px solid transparent;
                    margin: 8px 4px;
                }
            `}</style>
            <style jsx>{`
                .menu {
                    background-color: ${getStyleForMenu(theme)["backgroundColor"]};
                    border-color: ${getStyleForMenu(theme)["borderColor"]};
                }
                .other-menu {
                    background-color: ${getStyleForMenu(theme)["backgroundColor"]};
                    border-color: ${getStyleForMenu(theme)["borderColor"]};
                }
                .menu-button {
                    fill: ${getStyleForButton(theme)["fill"]};
                    background-color: ${getStyleForButton(theme)["backgroundColor"]};
                }
                .other-menu-button {
                    fill: ${getStyleForButton(theme)["fill"]};
                    stroke: ${getStyleForButton(theme)["fill"]};
                    background-color: ${getStyleForButton(theme)["backgroundColor"]};
                }
                .menu-button:hover {
                    fill: ${getStyleForButton(theme)["hoverFill"]};
                    background-color: ${getStyleForButton(theme)["hoverBackgroundColor"]};
                }
                .other-menu-button:hover {
                    fill: ${getStyleForButton(theme)["hoverFill"]};
                    stroke: ${getStyleForButton(theme)["hoverFill"]};
                    background-color: ${getStyleForButton(theme)["hoverBackgroundColor"]};
                }
                .spacer {
                    border-color: ${getStyleForMenu(theme)["borderColor"]};
                }
            `}</style>
        </div>
    )
}
