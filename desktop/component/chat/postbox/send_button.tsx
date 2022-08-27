import { CodeHighlightNode, CodeNode } from "@lexical/code"
import { MessageEntityStyleFormat, MessageEntityStyleNode } from "../../../api/object"
import { useCallback, useEffect, useState } from "react"

import GraphemeSplitter from "grapheme-splitter"
import { Themes } from "../../theme"
import { TooltipActionT } from "../../../state/component/tooltip"
import classNames from "classnames"
import lexical from "lexical"
import { mergeRegister } from "@lexical/utils"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { isString } from "../../../lib/type_check"

const initialEditorStateJSON = `{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}`

const getStyle = (theme: Themes) => {
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

function getFormat(node: lexical.TextNode) {
    let format = 0
    if (node.hasFormat("bold")) {
        format |= MessageEntityStyleFormat.BOLD
    }
    if (node.hasFormat("code")) {
        format |= MessageEntityStyleFormat.CODE
    }
    if (node.hasFormat("italic")) {
        format |= MessageEntityStyleFormat.ITALIC
    }
    if (node.hasFormat("strikethrough")) {
        format |= MessageEntityStyleFormat.STRIKETHROUGH
    }
    if (node.hasFormat("subscript")) {
        format |= MessageEntityStyleFormat.SUBSCRIPT
    }
    if (node.hasFormat("superscript")) {
        format |= MessageEntityStyleFormat.SUPERSCRIPT
    }
    if (node.hasFormat("underline")) {
        format |= MessageEntityStyleFormat.UNDERLINE
    }
    return format
}

function deserializeCodeHighlightState(
    codeNode: CodeNode,
    cursor
): [MessageEntityStyleNode[], number] {
    let text = ""
    const ret: MessageEntityStyleNode[] = []
    // @ts-ignore
    codeNode.getChildren().forEach((node: CodeHighlightNode) => {
        const nodeType = node.getType()
        if (nodeType == "linebreak") {
            text += "\n"
            ret.push({
                children: [],
                type: "text",
                text: text,
                style: null,
                indices: [cursor, cursor + text.length - 1],
            })
            cursor += text.length
            text = ""
        } else if (nodeType == "code-highlight") {
            text += node.getTextContent()
        }
    })
    if (text.length > 0) {
        ret.push({
            children: [],
            type: "text",
            text: text,
            style: null,
            indices: [cursor, cursor + text.length - 1],
        })
        cursor += text.length
        text = ""
    }
    return [ret, cursor]
}

function deserializeEditorState(
    currentNode: lexical.ElementNode,
    cursor: number,
    nestedElement: boolean
): [MessageEntityStyleNode[], number] {
    const nodeMap: MessageEntityStyleNode[] = []
    console.group("deserializeEditorState")
    const rootChildren = currentNode.getChildren()
    rootChildren.forEach((childNode, k) => {
        console.log("childNode", childNode)
        const nodeType = childNode.getType()
        if (nodeType == "code") {
            // @ts-ignore
            const [children, newCursor] = deserializeCodeHighlightState(childNode, cursor)
            cursor = newCursor
            nodeMap.push({
                children: children,
                // @ts-ignore
                language: childNode.__language,
                type: nodeType,
                style: null,
                indices: [],
            })
            console.log("code", cursor)
        } else if (nodeType == "list") {
            // @ts-ignore
            const [children, newCursor] = deserializeEditorState(childNode, cursor, nestedElement)
            cursor = newCursor
            nodeMap.push({
                children: children,
                type: nodeType,
                style: null,
                indices: [],
            })
            console.log("ListNode", cursor, nestedElement, rootChildren.length)
        } else if (nodeType == "listitem") {
            // @ts-ignore
            const [children, newCursor] = deserializeEditorState(childNode, cursor, true)
            cursor = newCursor
            nodeMap.push({
                children: children,
                type: nodeType,
                style: null,
                indices: [],
            })
            if (nestedElement == false && k != rootChildren.length - 1) {
                nodeMap.push({
                    children: [],
                    type: "linebreak",
                    text: "\n",
                    style: null,
                    indices: [cursor, cursor],
                })
                cursor += 1 // \n
                console.log("add linebreak")
            }
            console.log("ListItemNode", cursor, nestedElement, rootChildren.length)
        } else if (nodeType == "text") {
            const text = childNode.getTextContent()
            const style = childNode.__style
            var colorCode = null
            if (isString(style)) {
                const re = /color: (#[0-9a-f]{6})/
                const match = style.match(re)
                if (match) {
                    colorCode = match[1]
                }
            }
            const textLength = new GraphemeSplitter().splitGraphemes(text).length
            console.log("text", text, textLength, style, cursor)
            nodeMap.push({
                children: [],
                type: nodeType,
                text: text,
                style: {
                    // @ts-ignore
                    format: getFormat(childNode),
                    color: colorCode,
                },
                indices: [cursor, cursor + textLength - 1],
            })
            cursor += textLength
        } else if (nodeType == "heading") {
            // @ts-ignore
            const [children, newCursor] = deserializeEditorState(childNode, cursor, true)
            cursor = newCursor
            nodeMap.push({
                children: children.concat({
                    children: [],
                    type: "linebreak",
                    text: "\n",
                    style: null,
                    indices: [cursor, cursor],
                }),
                // @ts-ignore
                type: "heading_" + childNode.__tag[1],
                style: null,
                indices: [],
            })
            console.log("heading", cursor)
            cursor += 1 // \n
            console.log("add linebreak")
        } else if (nodeType == "quote") {
            // @ts-ignore
            const [children, newCursor] = deserializeEditorState(childNode, cursor, true)
            cursor = newCursor
            nodeMap.push({
                children: children.concat({
                    children: [],
                    type: "linebreak",
                    text: "\n",
                    style: null,
                    indices: [cursor, cursor],
                }),
                // @ts-ignore
                type: "quote",
                style: null,
                indices: [],
            })
            console.log("quote", cursor)
            cursor += 1 // \n
            console.log("add linebreak")
        } else if (nodeType == "linebreak") {
            nodeMap.push({
                children: [],
                type: nodeType,
                text: "\n",
                style: null,
                indices: [cursor, cursor],
            })
            cursor += 1 // \n
            console.log("Linebreak", cursor)
        } else if (nodeType == "paragraph") {
            // @ts-ignore
            const [children, newCursor] = deserializeEditorState(childNode, cursor, true)
            cursor = newCursor
            nodeMap.push({
                children: children.concat({
                    children: [],
                    type: "linebreak",
                    text: "\n",
                    style: null,
                    indices: [cursor, cursor],
                }),
                type: nodeType,
                style: null,
                indices: [],
            })
            console.log("paragraph", cursor)
            cursor += 1 // \n
            console.log("add linebreak")
        } else {
            //     nodeMap.push({
            //         children: [],
            //         type: nodeType,
            //         text: null,
            //         style: null,
            //         indices: [],
            //     })
        }
    })
    console.groupEnd()
    return [nodeMap, cursor]
}

function restorePlainText(nodes: MessageEntityStyleNode[], depth = 0) {
    if (nodes.length == 0) {
        return ""
    }
    console.group("restorePlainText")
    let text = ""
    nodes.forEach((node, k) => {
        console.log(node)
        if (node.children.length == 0) {
            if (node.type == "text") {
                text += node.text
                return
            }
            if (node.type == "linebreak") {
                text += "\n"
                return
            }
        } else {
            text += restorePlainText(node.children, depth + 1)
        }
    })
    console.groupEnd()
    if (depth == 0) {
        if (text[text.length - 1] == "\n") {
            return text.slice(0, text.length - 1)
        }
    }
    return text
}

function removeTextKey(origNodes: MessageEntityStyleNode[]) {
    if (origNodes.length == 0) {
        return []
    }
    const newNodes = []
    origNodes.forEach((origNode, k) => {
        const newNode: MessageEntityStyleNode = {
            children: removeTextKey(origNode.children),
            type: origNode.type,
            style: origNode.style,
            indices: origNode.indices,
        }
        if (origNode.language) {
            newNode.language = origNode.language
        }
        newNodes.push(newNode)
    })
    return newNodes
}

function hasFormat(node: MessageEntityStyleNode) {
    if (node.type != "text") {
        return false
    }
    if (node.style == null) {
        return false
    }
    if (node.style.format == 0) {
        return false
    }
    return true
}

function hasStyle(nodes: MessageEntityStyleNode[]) {
    if (nodes.length == 1) {
        if (nodes[0].children.length == 0) {
            return false
        }
    }
    for (const node of nodes) {
        if (node.type !== "paragraph") {
            return true
        }
        if (node.children.length == 0) {
            continue
        }
        if (node.children.length != 1) {
            return true
        }
        const child = node.children[0]
        if (child.type !== "text") {
            return true
        }
        if (hasFormat(child)) {
            return true
        }
    }
    return false
}

export const SendButtonComponent = ({
    theme,
    tooltipAction,
    handlePostMessage,
}: {
    theme: Themes
    tooltipAction: TooltipActionT
    handlePostMessage: (text: string, styleMapJson: string) => Promise<boolean>
}) => {
    const [editor] = useLexicalComposerContext()
    const [plainText, setPlainText] = useState("")
    const [textStyle, setTextStyle] = useState({})
    const [textHasStyle, setTextHasStyle] = useState(false)

    const updateState = useCallback(() => {
        const [textStyleMap] = deserializeEditorState(lexical.$getRoot(), 0, false)
        const plainText = restorePlainText(textStyleMap)
        const payload = removeTextKey(textStyleMap)
        console.log(`'${plainText}'`)
        console.log(textStyleMap)
        console.log(payload)
        setTextStyle(payload)
        setPlainText(plainText)
        setTextHasStyle(hasStyle(textStyleMap))
    }, [editor])

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    updateState()
                })
            })
        )
    }, [editor, updateState])

    const handleClick = useCallback(
        async (event) => {
            event.preventDefault()
            const succeeded = await handlePostMessage(
                plainText,
                textHasStyle ? JSON.stringify(textStyle) : null
            )
            if (succeeded) {
                editor.setEditorState(editor.parseEditorState(initialEditorStateJSON))
                editor.focus()
            }
        },
        [editor, plainText, textStyle, textHasStyle]
    )

    return (
        <div
            className={classNames("send-button-container", {
                ready: plainText.length > 0,
            })}>
            <button className="send-message-button normal">
                <svg className="icon">
                    <use href="#icon-editor-send-outline"></use>
                </svg>
            </button>
            <button
                className="send-message-button active"
                onClick={handleClick}
                onMouseEnter={(e) => tooltipAction.show(e, "メッセージを投稿する")}
                onMouseLeave={() => tooltipAction.hide()}>
                <svg className="icon">
                    <use href="#icon-editor-send-fill"></use>
                </svg>
            </button>
            <style jsx>{`
                .send-message-button {
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
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 36px;
                }
                .send-message-button:last-child {
                    margin-right: 0;
                }
                .send-message-button > .icon {
                    width: 18px;
                    height: 18px;
                    text-align: center;
                    flex-shrink: 0;
                }
                .send-button-container {
                    position: relative;
                    width: 36px;
                }
                .send-button-container > .send-message-button.active {
                    opacity: 0;
                }
                .send-button-container.ready > .send-message-button.active {
                    opacity: 1;
                }
            `}</style>
            <style jsx>{`
                .send-message-button.normal {
                    background-color: ${getStyle(theme)["backgroundColor"]};
                }
                .send-message-button.active {
                    background-color: ${getStyle(theme)["focusBackgroundColor"]};
                }
                .send-message-button.active:hover {
                    background-color: ${getStyle(theme)["hoverBackgroundColor"]};
                }
                .send-message-button.normal > .icon {
                    fill: ${getStyle(theme)["fill"]};
                }
                .send-message-button.active > .icon {
                    fill: ${getStyle(theme)["hoverFill"]};
                }
                .send-message-button.active:hover > .icon {
                    fill: ${getStyle(theme)["hoverFill"]};
                }
            `}</style>
        </div>
    )
}
