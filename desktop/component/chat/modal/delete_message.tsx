import React, { MouseEvent } from "react"

import { DateComponent } from "../message/sender"
import { DeleteMessageModalActionT } from "../../../state/component/model/delete_message"
import { MessageObjectT } from "../../../api/object"
import { Themes } from "../../theme"
import classNames from "classnames"

const getContainerStyle = (theme: Themes) => {
    if (theme.global.current.light) {
        return {
            backgroundColor: "rgba(26, 28, 31, 0.2)",
        }
    }
    if (theme.global.current.dark) {
        return {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
        }
    }
    throw new Error()
}

export const MessageSenderComponent = ({
    message,
    theme,
}: {
    message: MessageObjectT
    theme: Themes
}) => {
    const user = message.user
    const display_name = user.display_name ? user.display_name : user.name
    const getStyle = (theme: Themes) => {
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
                <span className="at-str">@</span>
                <span className="name-str">{user.name}</span>
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
                    font-weight: normal;
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
                    line-height: 16px;
                }
                .at-str {
                    font-size: 16px;
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

const MessagePreviewComponent = ({
    message,
    theme,
}: {
    message: MessageObjectT | null
    theme: Themes
}) => {
    if (message == null) {
        return null
    }
    const getStyle = (theme: Themes) => {
        if (theme.global.current.light) {
            return {
                backgroundColor: "transparent",
                borderColor: "#d4d8dc",
            }
        }
        if (theme.global.current.dark) {
            return {
                backgroundColor: "#121316",
                borderColor: "transparent",
            }
        }
        throw new Error()
    }
    return (
        <div className="message">
            <div className="inner">
                <div className="message-left">
                    <div className="avatar-block">
                        <div className="avatar"></div>
                    </div>
                </div>
                <div className="message-right">
                    <MessageSenderComponent message={message} theme={theme} />
                    <div className="text">{message.text}</div>
                </div>
            </div>
            <style jsx>{`
                .message {
                    flex: 0 0 auto;
                    cursor: pointer;
                    padding: 16px 0;
                    margin-top: 4px;
                    position: relative;
                    border: 1px solid;
                    border-radius: 8px;
                }
                .inner {
                    display: flex;
                    flex-direction: row;
                    padding: 0 16px;
                }
                .created-at-block {
                    visibility: hidden;
                    text-align: right;
                    font-size: 13px;
                    font-weight: 300;
                    margin-top: 3px;
                }
                .message-left {
                    width: 45px;
                    flex: 0 0 auto;
                }
                .message-right {
                    margin-left: 12px;
                    flex: 1 1 auto;
                    min-width: 0;
                }
                .avatar {
                    width: 45px;
                    height: 45px;
                    background-color: #546de5;
                    mask: url('data:image/svg+xml;utf8,<svg preserveAspectRatio="none" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M 0, 100 C 0, 23 23, 0 100, 0 S 200, 23 200, 100 177, 200 100, 200 0, 177 0, 100" fill="white"></path></svg>');
                    mask-size: 100% 100%;
                    -webkit-mask-image: url('data:image/svg+xml;utf8,<svg preserveAspectRatio="none" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M 0, 100 C 0, 23 23, 0 100, 0 S 200, 23 200, 100 177, 200 100, 200 0, 177 0, 100" fill="white"></path></svg>');
                    border-radius: 0;
                }
                .text {
                    font-size: 16px;
                    margin-top: 2px;
                }
                .message.consecutive .text {
                    margin-top: 0;
                }
                .menu-container {
                    display: none;
                    position: absolute;
                    top: -16px;
                    right: 8px;
                }
                .message:hover > .menu-container {
                    display: block;
                }
            `}</style>
            <style jsx>{`
                .message {
                    background-color: ${getStyle(theme)["backgroundColor"]};
                    border-color: ${getStyle(theme)["borderColor"]};
                }
            `}</style>
        </div>
    )
}

export const DeleteMessageModalComponent = ({
    hidden,
    message,
    modalAction,
    deleteMessage,
    theme,
}: {
    hidden: boolean
    message: MessageObjectT | null
    modalAction: DeleteMessageModalActionT
    deleteMessage: (message: MessageObjectT) => void
    theme: Themes
}) => {
    console.info("DeleteMessageModalComponent::render")
    const handleClickBackgroun = (event: MouseEvent<HTMLDivElement>) => {
        event.preventDefault()
        // @ts-ignore
        if (event.target.className.indexOf("hide-modal-on-click") >= 0) {
            modalAction.hide()
        }
    }
    const getStyle = (theme: Themes) => {
        if (theme.global.current.light) {
            return {
                backgroundColor: "#fff",
                cancelButtonColor: "#323232",
                cancelButtonBackgroundColor: "#efefef",
                cancelButtonHoverBackgroundColor: "#e6e6e6",
                deleteButtonColor: "#fff",
                deleteButtonBackgroundColor: "#2a85ff",
                deleteButtonHoverBackgroundColor: "#0069f6",
            }
        }
        if (theme.global.current.dark) {
            return {
                backgroundColor: "#1a1c1f",
                cancelButtonColor: "#fff",
                cancelButtonBackgroundColor: "#3a3f46",
                cancelButtonHoverBackgroundColor: "#32363c",
                deleteButtonColor: "#fff",
                deleteButtonBackgroundColor: "#2a85ff",
                deleteButtonHoverBackgroundColor: "#0069f6",
            }
        }
        throw new Error()
    }
    return (
        <>
            <div
                className={classNames("modal-container hide-modal-on-click", {
                    hidden,
                })}
                onClick={handleClickBackgroun}>
                <div className="flex-container hide-modal-on-click">
                    <div className="modal hide-modal-on-click">
                        <div className="inner">
                            <div className="title-block">
                                <span className="title">メッセージを削除する</span>
                            </div>
                            <div className="description-block">
                                <p>このメッセージを削除しますか？</p>
                                <p>削除すると元に戻せません。</p>
                            </div>
                            <div className="preview-block">
                                <MessagePreviewComponent message={message} theme={theme} />
                            </div>
                            <div className="button-block">
                                <button
                                    className="action-button cancel"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        modalAction.hide()
                                    }}>
                                    キャンセル
                                </button>
                                <button
                                    className="action-button delete"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        deleteMessage(message)
                                        modalAction.hide()
                                    }}>
                                    削除する
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx>{`
                .modal-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    backdrop-filter: blur(5px);
                    z-index: 100;
                    opacity: 1;
                    transition: 0.1s;
                    visibility: visible;
                }
                .modal-container.hidden {
                    visibility: none;
                    z-index: 0;
                    opacity: 0;
                }
                .flex-container {
                    display: flex;
                    width: 100vw;
                    height: 100vh;
                    flex-direction: row;
                    justify-content: center;
                }
                .modal {
                    flex: 0 0 700px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                .inner {
                    border-radius: 8px;
                    box-shadow: 0px 0px 30px 6px rgba(26, 28, 31, 0.12);
                    box-sizing: border-box;
                    padding: 32px;
                }
                .title-block {
                    display: flex;
                    flex-direction: row;
                }
                .title {
                    font-size: 20px;
                    font-weight: 700;
                    line-height: 20px;
                    margin: 0;
                    padding: 0;
                }
                .description-block {
                    margin-top: 24px;
                }
                .description-block > p {
                    font-size: 16px;
                    line-height: 1.5em;
                    margin: 0;
                    padding: 0;
                }
                .preview-block {
                    padding: 24px 0;
                }
                .button-block {
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-end;
                }
                .action-button {
                    font-weight: 700;
                    font-size: 16px;
                    flex: 0 0 auto;
                    box-sizing: border-box;
                    margin-left: 10px;
                    padding: 0 24px;
                    cursor: pointer;
                    border: none;
                    border-radius: 50px;
                    height: 42px;
                    transition: 0.3s;
                    outline: none;
                }
            `}</style>
            <style jsx>{`
                .modal-container {
                    background-color: ${getContainerStyle(theme)["backgroundColor"]};
                }
                .inner {
                    background-color: ${getStyle(theme)["backgroundColor"]};
                }
                .action-button.cancel {
                    color: ${getStyle(theme)["cancelButtonColor"]};
                    background-color: ${getStyle(theme)["cancelButtonBackgroundColor"]};
                }
                .action-button.cancel:hover {
                    background-color: ${getStyle(theme)["cancelButtonHoverBackgroundColor"]};
                }
                .action-button.delete {
                    color: ${getStyle(theme)["deleteButtonColor"]};
                    background-color: ${getStyle(theme)["deleteButtonBackgroundColor"]};
                }
                .action-button.delete:hover {
                    background-color: ${getStyle(theme)["deleteButtonHoverBackgroundColor"]};
                }
            `}</style>
        </>
    )
}
