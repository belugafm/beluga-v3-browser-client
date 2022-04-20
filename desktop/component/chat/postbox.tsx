import { Editor, EditorState } from "draft-js"
import React, { useContext, useRef, useState } from "react"
import { Themes, useTheme } from "../theme"

import { ContentStateT } from "../../state/chat/store/types/app_state"
import { DomainDataContext } from "../../state/chat/store/domain_data"
import { TooltipActionT } from "../../state/component/tooltip"
import classNames from "classnames"
import { usePostboxState } from "../../state/chat/components/postbox"

const getStyleForTextarea = (theme: Themes) => {
    if (theme.global.current.light) {
        return {
            color: "#191919",
            placeholderColor: "#aaa",
            backgroundColor: "#fff",
            borderColor: "#d8dadc",
            focusBackgroundColor: "#fff",
            focusBorderColor: "#6f767d",
        }
    }
    if (theme.global.current.dark) {
        return {
            color: "#fcfcfc",
            placeholderColor: "#616d78",
            backgroundColor: "#111315",
            borderColor: "#111315",
            focusBackgroundColor: "#272b2f",
            focusBorderColor: "#272b2f",
        }
    }
    throw new Error()
}

const getStyleForEditorButton = (theme: Themes) => {
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

const getStyleForSendButton = (theme: Themes) => {
    if (theme.global.current.light) {
        return {
            fill: "#1a1d1f",
            hoverFill: "#fff",
            backgroundColor: "#f4f4f4",
            hoverBackgroundColor: "#0069f6",
            focusBackgroundColor: "#2a85ff",
        }
    }
    if (theme.global.current.dark) {
        return {
            fill: "#616d78",
            hoverFill: "#fff",
            backgroundColor: "#191c1f",
            hoverBackgroundColor: "#0069f6",
            focusBackgroundColor: "#2a85ff",
        }
    }
    throw new Error()
}

const getPlaceholderText = (content: ContentStateT) => {
    const domainData = useContext(DomainDataContext)
    if (content.context.channelId) {
        const channel = domainData.channels.get(content.context.channelId)
        if (channel) {
            return `${channel.status_string}${channel.name} へのメッセージを入力`
        }
    }
    return ""
}

export const PostboxComponent = ({
    content,
    tooltipAction,
}: {
    content: ContentStateT
    tooltipAction: TooltipActionT
}) => {
    const [theme] = useTheme()
    // const textarea = useRef(null)
    // const handleClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    //     event.preventDefault()
    //     await updateStatus()
    //     textarea.current.focus()
    // }
    const [editorState, setEditorState] = useState<EditorState>(() => EditorState.createEmpty())
    const editor = useRef(null)
    function focusEditor() {
        editor.current.focus()
    }
    const { handlePostMessage } = usePostboxState({
        query: content.postbox.query,
        content,
        editorState,
    })
    const [isTextAttributeBlockHidden, setIsTextAttributeBlockHidden] = useState(true)
    return (
        <>
            <div className="postbox-container">
                <div className="postbox">
                    <div
                        className={classNames("text-attribute-block", {
                            hidden: isTextAttributeBlockHidden,
                        })}>
                        <button
                            className="editor-button bold"
                            onMouseEnter={(e) => tooltipAction.show(e, "太字")}
                            onMouseLeave={() => tooltipAction.hide()}>
                            <svg className="icon">
                                <use href="#icon-editor-bold"></use>
                            </svg>
                        </button>
                        <button
                            className="editor-button italic"
                            onMouseEnter={(e) => tooltipAction.show(e, "イタリック体")}
                            onMouseLeave={() => tooltipAction.hide()}>
                            <svg className="icon">
                                <use href="#icon-editor-italic"></use>
                            </svg>
                        </button>
                        <button
                            className="editor-button strikethrough"
                            onMouseEnter={(e) => tooltipAction.show(e, "打ち消し線")}
                            onMouseLeave={() => tooltipAction.hide()}>
                            <svg className="icon">
                                <use href="#icon-editor-strikethrough"></use>
                            </svg>
                        </button>
                        <button
                            className="editor-button underline"
                            onMouseEnter={(e) => tooltipAction.show(e, "下線")}
                            onMouseLeave={() => tooltipAction.hide()}>
                            <svg className="icon">
                                <use href="#icon-editor-underline"></use>
                            </svg>
                        </button>
                        <button
                            className="editor-button code"
                            onMouseEnter={(e) => tooltipAction.show(e, "コードブロック")}
                            onMouseLeave={() => tooltipAction.hide()}>
                            <svg className="icon">
                                <use href="#icon-editor-code"></use>
                            </svg>
                        </button>
                        <button
                            className="editor-button palette"
                            onMouseEnter={(e) => tooltipAction.show(e, "文字色")}
                            onMouseLeave={() => tooltipAction.hide()}>
                            <svg className="icon">
                                <use href="#icon-editor-palette"></use>
                            </svg>
                        </button>
                    </div>
                    <div className="textarea-block" onClick={focusEditor}>
                        <Editor
                            ref={editor}
                            editorState={editorState}
                            onChange={setEditorState}
                            placeholder={getPlaceholderText(content)}
                        />
                    </div>
                    <div className="editor-block">
                        <div className="left">
                            <button
                                className="editor-button upload"
                                onMouseEnter={(e) =>
                                    tooltipAction.show(e, "ファイルをアップロード")
                                }
                                onMouseLeave={() => tooltipAction.hide()}>
                                <svg className="icon">
                                    <use href="#icon-editor-attachment"></use>
                                </svg>
                            </button>
                            <button
                                className="editor-button input-emoji"
                                onMouseEnter={(e) => tooltipAction.show(e, "絵文字を入力")}
                                onMouseLeave={() => tooltipAction.hide()}>
                                <svg className="icon">
                                    <use href="#icon-editor-emoji"></use>
                                </svg>
                            </button>
                            <button
                                className="editor-button toggle-text-editor"
                                onClick={() => {
                                    setIsTextAttributeBlockHidden(!isTextAttributeBlockHidden)
                                }}
                                onMouseEnter={(e) => tooltipAction.show(e, "書式設定を表示")}
                                onMouseLeave={() => tooltipAction.hide()}>
                                <svg className="icon">
                                    <use href="#icon-editor-font-size"></use>
                                </svg>
                            </button>
                        </div>
                        <div className="right">
                            <div
                                className={classNames("send-button-container", {
                                    ready:
                                        editorState.getCurrentContent().getPlainText().length > 0,
                                })}>
                                <button className="editor-button send-message normal">
                                    <svg className="icon">
                                        <use href="#icon-editor-send-outline"></use>
                                    </svg>
                                </button>
                                <button
                                    className="editor-button send-message active"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        const succeeded = handlePostMessage(
                                            editorState.getCurrentContent().getPlainText()
                                        )
                                        if (succeeded) {
                                            setEditorState(EditorState.createEmpty())
                                        }
                                    }}
                                    onMouseEnter={(e) =>
                                        tooltipAction.show(e, "メッセージを投稿する")
                                    }
                                    onMouseLeave={() => tooltipAction.hide()}>
                                    <svg className="icon">
                                        <use href="#icon-editor-send-fill"></use>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx global>{`
                .DraftEditor-root {
                    font-size: 15px;
                    position: relative;
                }
                .public-DraftEditorPlaceholder-root {
                    position: absolute;
                    top: 0;
                }
            `}</style>
            <style jsx global>{`
                .public-DraftEditorPlaceholder-root {
                    color: ${getStyleForTextarea(theme)["placeholderColor"]};
                }
            `}</style>
            <style jsx>{`
                .postbox-container {
                    padding: 12px;
                }
                .postbox {
                    border-radius: 8px;
                    border: 1px solid transparent;
                }
                .text-attribute-block {
                    display: flex;
                    flex-direction: row;
                    padding: 4px;
                    margin-bottom: -8px;
                }
                .text-attribute-block.hidden {
                    display: none;
                }
                .textarea-block {
                    cursor: text;
                    min-height: 1em;
                    padding: 10px 10px 2px 10px;
                    box-sizing: border-box;
                }
                .editor-block {
                    display: flex;
                    flex-direction: row;
                    padding: 4px;
                }
                .editor-block > .left {
                    flex: 1 1 auto;
                    display: flex;
                    flex-direction: row;
                }
                .editor-block > .right {
                    flex: 1 1 auto;
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-end;
                }
                .editor-button {
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
                .editor-button:last-child {
                    margin-right: 0;
                }
                .editor-button > .icon {
                    width: 18px;
                    height: 18px;
                    text-align: center;
                    flex-shrink: 0;
                }
                .editor-button.upload > .icon {
                    width: 20px;
                    height: 20px;
                }
                .editor-button.strikethrough > .icon {
                    width: 20px;
                    height: 20px;
                }
                .editor-button.underline > .icon {
                    width: 20px;
                    height: 20px;
                }
                .editor-button.toggle-text-editor > .icon {
                    width: 22px;
                    height: 22px;
                    margin-top: 3px;
                }
                .send-button-container {
                    position: relative;
                    width: 36px;
                }
                .editor-button.send-message {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 36px;
                }
                .send-button-container > .editor-button.send-message.active {
                    opacity: 0;
                }
                .send-button-container.ready > .editor-button.send-message.active {
                    opacity: 1;
                }
            `}</style>
            <style jsx>{`
                .postbox {
                    color: ${getStyleForTextarea(theme)["color"]};
                    background-color: ${getStyleForTextarea(theme)["backgroundColor"]};
                    border-color: ${getStyleForTextarea(theme)["borderColor"]};
                }
                .postbox.active {
                    border-color: ${getStyleForTextarea(theme)["focusBorderColor"]};
                    background-color: ${getStyleForTextarea(theme)["focusBackgroundColor"]};
                }
                .editor-button.send-message.normal {
                    background-color: ${getStyleForSendButton(theme)["backgroundColor"]};
                }
                .editor-button.send-message.active {
                    background-color: ${getStyleForSendButton(theme)["focusBackgroundColor"]};
                }
                .editor-button.send-message.active:hover {
                    background-color: ${getStyleForSendButton(theme)["hoverBackgroundColor"]};
                }
                .editor-button.send-message.normal > .icon {
                    fill: ${getStyleForSendButton(theme)["fill"]};
                }
                .editor-button.send-message.active > .icon {
                    fill: ${getStyleForSendButton(theme)["hoverFill"]};
                }
                .editor-button.send-message.active:hover > .icon {
                    fill: ${getStyleForSendButton(theme)["hoverFill"]};
                }
                .editor-button {
                    fill: ${getStyleForEditorButton(theme)["fill"]};
                    background-color: ${getStyleForEditorButton(theme)["backgroundColor"]};
                }
                .editor-button:hover {
                    fill: ${getStyleForEditorButton(theme)["hoverFill"]};
                    background-color: ${getStyleForEditorButton(theme)["hoverBackgroundColor"]};
                }
                .editor-button.toggle-text-editor {
                    fill: ${getStyleForEditorButton(theme)["fill"]};
                    stroke: ${getStyleForEditorButton(theme)["fill"]};
                    background-color: ${getStyleForEditorButton(theme)["backgroundColor"]};
                }
                .editor-button.toggle-text-editor:hover {
                    fill: ${getStyleForEditorButton(theme)["hoverFill"]};
                    stroke: ${getStyleForEditorButton(theme)["hoverFill"]};
                    background-color: ${getStyleForEditorButton(theme)["hoverBackgroundColor"]};
                }
            `}</style>
        </>
    )
}
