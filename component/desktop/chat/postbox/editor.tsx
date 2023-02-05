import { ThemeT, useTheme } from "../../../theme"

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin"
import { CodeHighlightPlugin } from "./plugins/code_highlight"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { ContentStateT } from "../../../../state/chat/store/types/app_state"
import { DomainDataContext } from "../../../../state/chat/store/domain_data"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { ListMaxIndentLevelPlugin } from "./plugins/list_max_indent_level"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { ToolbarPlugin } from "./plugins/toolbar"
import { useContext } from "react"

const getPlaceholderColor = (theme: ThemeT) => {
    if (theme.global.current.light) {
        return "#aaa"
    }
    if (theme.global.current.dark) {
        return "#646464"
    }
    throw new Error()
}

const Placeholder = ({ text, theme }) => {
    return (
        <>
            <div>{text}</div>
            <style jsx>{`
                div {
                    color: ${getPlaceholderColor(theme)};
                    overflow: hidden;
                    position: absolute;
                    text-overflow: ellipsis;
                    top: 14px;
                    left: 10px;
                    font-size: 15px;
                    user-select: none;
                    display: inline-block;
                    pointer-events: none;
                }
            `}</style>
        </>
    )
}

export const getPlaceholderText = (content: ContentStateT) => {
    const domainData = useContext(DomainDataContext)
    if (content.context.channelId) {
        const channel = domainData.channels.get(content.context.channelId)
        if (channel) {
            return `${channel.status_string}${channel.name} へのメッセージを入力`
        }
    }
    return ""
}

const getTextareaColor = (theme: ThemeT) => {
    if (theme.global.current.light) {
        return "#191919"
    }
    if (theme.global.current.dark) {
        return "#fcfcfc"
    }
    throw new Error()
}

const getStyleForEditorCode = (theme: ThemeT) => {
    if (theme.global.current.light) {
        return {
            color: "rgb(165, 170, 145)",
            codeColor: "rgb(248, 248, 242)",
            hoverColor: "#1a1d1f",
            backgroundColor: "rgb(35, 36, 31)",
        }
    }
    if (theme.global.current.dark) {
        return {
            color: "#616d78",
            codeColor: "rgb(248, 248, 242)",
            hoverColor: "#fcfcfc",
            backgroundColor: "#020203",
        }
    }
    throw new Error()
}

const getStyleForInlineCode = (theme: ThemeT) => {
    if (theme.global.current.light) {
        return {
            borderColor: "#a5aa91",
            backgroundColor: "#e8e8e8",
        }
    }
    if (theme.global.current.dark) {
        return {
            borderColor: "#33383c",
            backgroundColor: "#08080a",
        }
    }
    throw new Error()
}

const getStyleForQuote = (theme: ThemeT) => {
    if (theme.global.current.light) {
        return {
            borderColor: "#aaaaa9",
            color: "#828282",
        }
    }
    if (theme.global.current.dark) {
        return {
            borderColor: "#b9bfc8",
            color: "#8d97a0",
        }
    }
    throw new Error()
}

export function EditorComponent({
    content,
    isTextAttributeBlockHidden,
}: {
    content: ContentStateT
    isTextAttributeBlockHidden: boolean
}) {
    const [theme] = useTheme()
    const placeholderText = getPlaceholderText(content)
    return (
        <>
            <div className="__global-editor-container">
                <ToolbarPlugin hidden={isTextAttributeBlockHidden} />
                <div className="__global-editor-inner">
                    <RichTextPlugin
                        contentEditable={<ContentEditable className="__global-editor-input" />}
                        placeholder={<Placeholder theme={theme} text={placeholderText} />}
                    />
                    <HistoryPlugin />
                    <AutoFocusPlugin />
                    <CodeHighlightPlugin />
                    <ListPlugin />
                    <ListMaxIndentLevelPlugin maxDepth={3} />
                </div>
            </div>
            <style jsx global>{`
                .__global-editor-input {
                    color: ${getTextareaColor(theme)};
                }
            `}</style>
            <style jsx global>{`
                .__global-editor-input h1 {
                    font-size: 24px;
                }
                .__global-editor-container {
                    position: relative;
                    line-height: 20px;
                    font-weight: 400;
                    text-align: left;
                    border-top-left-radius: 10px;
                    border-top-right-radius: 10px;
                }
                .__global-editor-inner {
                    position: relative;
                }
                .__global-editor-input {
                    resize: none;
                    font-size: 15px;
                    position: relative;
                    tab-size: 1;
                    outline: 0;
                    padding: 14px 10px;
                }
                .__global-editor-text-bold {
                    font-weight: 700;
                }
                .__global-editor-text-italic {
                    font-style: italic;
                }
                .__global-editor-text-underline {
                    text-decoration: underline;
                }
                .__global-editor-text-strikethrough {
                    text-decoration: line-through;
                }
                .__global-editor-text-underlineStrikethrough {
                    text-decoration: underline line-through;
                }
                .__global-editor-text-code {
                    border-radius: 4px;
                    padding: 2px 6px;
                    margin: 0 4px;
                    font-size: 13px;
                    border: 1px solid;
                }
                .__global-editor-code {
                    font-family: Menlo, Consolas, Monaco, monospace;
                    display: block;
                    padding: 8px 8px 8px 52px;
                    line-height: 1.53;
                    font-size: 13px;
                    margin: 0;
                    margin-top: 8px;
                    margin-bottom: 8px;
                    tab-size: 2;
                    /* white-space: pre; */
                    overflow-x: auto;
                    position: relative;
                }
                .__global-editor-code:before {
                    content: attr(data-gutter);
                    position: absolute;
                    left: 0;
                    top: 0;
                    padding: 8px;
                    white-space: pre-wrap;
                    text-align: right;
                    min-width: 25px;
                }
                .__global-editor-code:after {
                    content: attr(data-highlight-language);
                    top: 0;
                    right: 3px;
                    padding: 3px;
                    font-size: 10px;
                    text-transform: uppercase;
                    position: absolute;
                }
                .__global-editor-tokenComment {
                    color: slategray;
                }
                .__global-editor-tokenPunctuation {
                    color: #999;
                }
                .__global-editor-tokenProperty {
                    color: rgb(174, 129, 255);
                }
                .__global-editor-tokenSelector {
                    color: rgb(230, 219, 116);
                }
                .__global-editor-tokenOperator {
                    color: #9a6e3a;
                }
                .__global-editor-tokenAttr {
                    color: rgb(249, 38, 114);
                }
                .__global-editor-tokenVariable {
                    color: #e90;
                }
                .__global-editor-tokenFunction {
                    color: rgb(230, 219, 116);
                }
                .__global-editor-paragraph {
                    margin: 0;
                    margin-bottom: 8px;
                    position: relative;
                }
                .__global-editor-paragraph:last-child {
                    margin-bottom: 0;
                }
                .__global-editor-heading-h1 {
                    font-size: 26px;
                    font-weight: 400;
                    margin: 16px 0;
                    padding: 0;
                }
                .__global-editor-heading-h1:first-child {
                    margin-top: 0;
                }
                .__global-editor-heading-h1:last-child {
                    margin-bottom: 0;
                }
                .__global-editor-heading-h2 {
                    font-size: 20px;
                    font-weight: 400;
                    margin: 16px 0;
                    padding: 0;
                }
                .__global-editor-heading-h2:first-child {
                    margin-top: 0;
                }
                .__global-editor-heading-h2:last-child {
                    margin-bottom: 0;
                }
                .__global-editor-quote {
                    margin: 0 0 8px 4px;
                    font-size: 15px;
                    border-left-width: 4px;
                    border-left-style: solid;
                    padding-left: 12px;
                }
                .__global-editor-list-ol {
                    padding: 0;
                    margin: 0;
                    margin-left: 16px;
                }
                .__global-editor-list-ul {
                    padding: 0;
                    margin: 0;
                    margin-left: 16px;
                }
                .__global-editor-listitem {
                    margin: 8px 32px 8px 32px;
                }
                .__global-editor-nested-listitem {
                    list-style-type: none;
                }
            `}</style>
            <style jsx global>{`
                .__global-editor-text-code {
                    background-color: ${getStyleForInlineCode(theme)["backgroundColor"]};
                    border-color: ${getStyleForInlineCode(theme)["borderColor"]};
                }
                .__global-editor-code {
                    color: ${getStyleForEditorCode(theme)["codeColor"]};
                    background-color: ${getStyleForEditorCode(theme)["backgroundColor"]};
                }
                .__global-editor-code:before {
                    background-color: ${getStyleForEditorCode(theme)["backgroundColor"]};
                    color: ${getStyleForEditorCode(theme)["color"]};
                }
                .__global-editor-code:after {
                    color: ${getStyleForEditorCode(theme)["color"]};
                }
                .__global-editor-quote {
                    color: ${getStyleForQuote(theme)["color"]};
                    border-left-color: ${getStyleForQuote(theme)["borderColor"]};
                }
            `}</style>
        </>
    )
}
