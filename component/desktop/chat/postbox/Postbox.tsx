import { $createParagraphNode, $createTextNode, $getRoot } from "lexical"
import { CodeHighlightNode, CodeNode } from "@lexical/code"
import { HeadingNode, QuoteNode } from "@lexical/rich-text"
import { ListItemNode, ListNode } from "@lexical/list"
import React, { useCallback, useRef, useState } from "react"
import { ThemeT, useTheme } from "../../../theme"

import { ContentStateT } from "../../../../state/chat/store/types/app_state"
import { EditorComponent } from "./Editor"
import ExampleTheme from "./themes/ExampleTheme"
import { FileObjectT } from "../../../../api/object"
import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { SendButtonComponent } from "./SendButton"
import { TooltipActionT } from "../../../../state/component/tooltip"
import { postFormData } from "../../../../api/fetch"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { usePostboxAction } from "../../../../state/chat/actions/postbox"

const editorConfig = {
    // The editor theme
    theme: ExampleTheme,
    // Handling of errors during update
    onError(error) {
        throw error
    },
    namespace: "chat",
    editorState: undefined,
    // Any custom nodes go here
    nodes: [HeadingNode, ListNode, ListItemNode, QuoteNode, CodeNode, CodeHighlightNode],
}

const getTextareaStyle = (theme: ThemeT) => {
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
            placeholderColor: "#787878",
            backgroundColor: "#0f0f0f",
            borderColor: "#0f0f0f",
            focusBackgroundColor: "#2f2f2f",
            focusBorderColor: "#2f2f2f",
        }
    }
    throw new Error()
}

const getEditorButtonStyle = (theme: ThemeT) => {
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
            fill: "#787878",
            hoverFill: "#fcfcfc",
            backgroundColor: "#0f0f0f",
            hoverBackgroundColor: "#242424",
        }
    }
    throw new Error()
}

const getOriginalFileUrl = (files: FileObjectT[] | null): string | null => {
    if (files == null) {
        return null
    }
    for (const file of files) {
        if (file.original) {
            return file.url
        }
    }
    return null
}

const _PostboxComponent = ({
    content,
    tooltipAction,
}: {
    content: ContentStateT
    tooltipAction: TooltipActionT
}) => {
    const fileInputRef = useRef(null)
    const [editor] = useLexicalComposerContext()
    // console.log(JSON.stringify(editor.getEditorState().toJSON()))
    const [theme] = useTheme()
    const { postMessage: handlePostMessage } = usePostboxAction({
        query: content.postbox.query,
        content,
    })
    const [isTextAttributeBlockHidden, setIsTextAttributeBlockHidden] = useState(true)
    const onClickUpload = useCallback(
        (e) => {
            e.preventDefault()
            fileInputRef.current.value = ""
            fileInputRef.current.click()
        },
        [fileInputRef]
    )
    const handleUploadMedia = useCallback(
        async (e) => {
            const files = e.target.files
            for (let n = 0; n < files.length; n++) {
                const file = files.item(n)
                var formData = new FormData()
                formData.append("file", file)
                const result = await postFormData("upload/media", formData)
                const url = getOriginalFileUrl(result.files)
                if (url) {
                    editor.update(() => {
                        const root = $getRoot()
                        const paragraphNode = $createParagraphNode()
                        const textNode = $createTextNode(url)
                        paragraphNode.append(textNode)
                        root.append(paragraphNode)
                    })
                }
            }
        },
        [editor]
    )
    if (content.postbox.enabled == false) {
        return null
    }
    return (
        <>
            <div className="postbox-container">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleUploadMedia}
                    multiple
                    hidden
                />
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
                                onMouseLeave={() => tooltipAction.hide()}
                                onClick={onClickUpload}>
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
                    color: ${getTextareaStyle(theme)["placeholderColor"]};
                }
            `}</style>
            <style jsx>{`
                .postbox-container {
                    padding: 16px;
                }
                .postbox {
                    border-radius: 8px;
                    overflow: hidden;
                    border: 1px solid transparent;
                    transition-duration: 0.2s;
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
                    color: ${getTextareaStyle(theme)["color"]};
                    background-color: ${getTextareaStyle(theme)["backgroundColor"]};
                    border-color: ${getTextareaStyle(theme)["borderColor"]};
                }
                .postbox.active {
                    border-color: ${getTextareaStyle(theme)["focusBorderColor"]};
                    background-color: ${getTextareaStyle(theme)["focusBackgroundColor"]};
                }
                .editor-button {
                    fill: ${getEditorButtonStyle(theme)["fill"]};
                    background-color: ${getEditorButtonStyle(theme)["backgroundColor"]};
                }
                .editor-button:hover {
                    fill: ${getEditorButtonStyle(theme)["hoverFill"]};
                    background-color: ${getEditorButtonStyle(theme)["hoverBackgroundColor"]};
                }
                .editor-button.toggle-text-editor {
                    fill: ${getEditorButtonStyle(theme)["fill"]};
                    stroke: ${getEditorButtonStyle(theme)["fill"]};
                    background-color: ${getEditorButtonStyle(theme)["backgroundColor"]};
                }
                .editor-button.toggle-text-editor:hover {
                    fill: ${getEditorButtonStyle(theme)["hoverFill"]};
                    stroke: ${getEditorButtonStyle(theme)["hoverFill"]};
                    background-color: ${getEditorButtonStyle(theme)["hoverBackgroundColor"]};
                }
            `}</style>
        </>
    )
}

export const PostboxComponent = ({
    content,
    tooltipAction,
}: {
    content: ContentStateT
    tooltipAction: TooltipActionT
}) => {
    return (
        <LexicalComposer initialConfig={editorConfig}>
            <_PostboxComponent content={content} tooltipAction={tooltipAction} />
        </LexicalComposer>
    )
}
