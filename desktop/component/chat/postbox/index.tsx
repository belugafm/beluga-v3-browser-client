import { CodeHighlightNode, CodeNode } from "@lexical/code"
import { HeadingNode, QuoteNode } from "@lexical/rich-text"
import { ListItemNode, ListNode } from "@lexical/list"
import React, { useState } from "react"
import { Themes, useTheme } from "../../theme"

import { ContentStateT } from "../../../state/chat/store/types/app_state"
import { EditorComponent } from "./editor"
import ExampleTheme from "./themes/ExampleTheme"
import LexicalComposer from "@lexical/react/LexicalComposer"
import { SendButtonComponent } from "./send_button"
import { TooltipActionT } from "../../../state/component/tooltip"
import classNames from "classnames"
import { usePostboxState } from "../../../state/chat/components/postbox"

const editorConfig = {
    // The editor theme
    theme: ExampleTheme,
    // Handling of errors during update
    onError(error) {
        throw error
    },
    // Any custom nodes go here
    nodes: [HeadingNode, ListNode, ListItemNode, QuoteNode, CodeNode, CodeHighlightNode],
}

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

export const PostboxComponent = ({
    content,
    tooltipAction,
}: {
    content: ContentStateT
    tooltipAction: TooltipActionT
}) => {
    const [theme] = useTheme()
    const { handlePostMessage } = usePostboxState({
        query: content.postbox.query,
        content,
    })
    const [isTextAttributeBlockHidden, setIsTextAttributeBlockHidden] = useState(true)
    if (content.postbox.enabled == false) {
        return null
    }
    return (
        <LexicalComposer initialConfig={editorConfig}>
            <div className="postbox-container">
                <div className="postbox">
                    <div className="textarea-block">
                        <EditorComponent
                            content={content}
                            isTextAttributeBlockHidden={isTextAttributeBlockHidden}
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
                            <SendButtonComponent
                                handlePostMessage={handlePostMessage}
                                tooltipAction={tooltipAction}
                                theme={theme}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <style jsx global>{`
                .textarea-block div[role="textbox"] {
                    outline: none;
                }
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
                    overflow: hidden;
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
        </LexicalComposer>
    )
}
