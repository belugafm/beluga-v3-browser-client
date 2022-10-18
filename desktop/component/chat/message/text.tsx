import {
    MessageEntityStyleFormat,
    MessageEntityStyleNode,
    MessageObjectT,
} from "../../../api/object"

import { MessagePropsT } from "./types"
import GraphemeSplitter from "grapheme-splitter"
import React from "react"
import SyntaxHighlighter from "react-syntax-highlighter"
import { Themes } from "../../theme"
import classnames from "classnames"
import { monokaiSublime } from "react-syntax-highlighter/dist/cjs/styles/hljs"

export const sliceText = (textGraphemes: string[], node: MessageEntityStyleNode) => {
    if (node.indices.length == 0) {
        return ""
    }
    const start = node.indices[0]
    const end = node.indices[1] + 1
    return textGraphemes.slice(start, end).join("")
}

export const getCodeContent = (text: string[], codeNode: MessageEntityStyleNode) => {
    if (codeNode.children.length == 0) {
        return ""
    }
    try {
        let content = ""
        codeNode.children.forEach((child) => {
            if (child.children.length > 0) {
                throw Error()
            }
            if (child.type !== "text") {
                throw Error()
            }
            content += sliceText(text, child)
        })
        return content
    } catch (error) {
        return "不正なコードです"
    }
}

const getStyleForSyntaxHighlighting = (theme: Themes) => {
    if (theme.global.current.light || theme.global.current.lightWithBgImage) {
        return {
            lineNumberColor: "#a5aa91",
            backgroundColor: "rgb(35, 36, 31)",
        }
    }
    if (theme.global.current.dark || theme.global.current.darkWithBgImage) {
        return {
            lineNumberColor: "#505764",
            backgroundColor: "#0d0e10",
        }
    }
    throw new Error()
}

const getStyleForInlineCode = (theme: Themes) => {
    if (theme.global.current.light || theme.global.current.lightWithBgImage) {
        return {
            borderColor: "#a5aa91",
            backgroundColor: "#e8e8e8",
        }
    }
    if (theme.global.current.dark || theme.global.current.darkWithBgImage) {
        return {
            borderColor: "#33383c",
            backgroundColor: "#08080a",
        }
    }
    throw new Error()
}

const getStyleForQuote = (theme: Themes) => {
    if (theme.global.current.light || theme.global.current.lightWithBgImage) {
        return {
            borderColor: "#aaaaa9",
            color: "#828282",
        }
    }
    if (theme.global.current.dark || theme.global.current.darkWithBgImage) {
        return {
            borderColor: "#b9bfc8",
            color: "#8d97a0",
        }
    }
    throw new Error()
}

const hasFormat = (nodeFormat: number, styleFormat: number) => {
    return (nodeFormat & styleFormat) !== 0
}

export const styledNodeToDOM = (
    textGraphemes: string[],
    node: MessageEntityStyleNode,
    theme: Themes
) => {
    if (node.type == "text") {
        if (node.style) {
            let textDecoration = ""
            if (hasFormat(node.style.format, MessageEntityStyleFormat.STRIKETHROUGH)) {
                textDecoration += "line-through "
            }
            if (hasFormat(node.style.format, MessageEntityStyleFormat.UNDERLINE)) {
                textDecoration += "underline "
            }
            const fontWeight = hasFormat(node.style.format, MessageEntityStyleFormat.BOLD)
                ? 700
                : 400
            const fontStyle = hasFormat(node.style.format, MessageEntityStyleFormat.ITALIC)
                ? "italic"
                : "normal"
            var style = node.style.color
                ? {
                      color: node.style.color,
                  }
                : {}
            return (
                <>
                    <span
                        style={style}
                        className={classnames({
                            code: hasFormat(node.style.format, MessageEntityStyleFormat.CODE),
                        })}>
                        {sliceText(textGraphemes, node)}
                    </span>
                    <style jsx>{`
                        span {
                            font-weight: ${fontWeight};
                            font-style: ${fontStyle};
                            text-decoration-line: ${textDecoration};
                        }
                        span.code {
                            background: ${getStyleForInlineCode(theme)["backgroundColor"]};
                            border-radius: 4px;
                            padding: 2px 6px;
                            margin: 0 4px;
                            font-size: 13px;
                            border: 1px solid ${getStyleForInlineCode(theme)["borderColor"]};
                        }
                    `}</style>
                </>
            )
        } else {
            return <span>{sliceText(textGraphemes, node)}</span>
        }
    }
    const inner = node.children.map((child, index) => {
        const dom = styledNodeToDOM(textGraphemes, child, theme)
        if (dom) {
            return React.cloneElement(dom, { key: index })
        } else {
            return null
        }
    })
    if (node.type == "paragraph") {
        return (
            <>
                <p>{inner}</p>
                <style jsx>{`
                    p {
                        line-height: 1.3em;
                        margin: 0;
                        padding: 0;
                    }
                `}</style>
            </>
        )
    }
    if (node.type == "quote") {
        return (
            <>
                <blockquote>{inner}</blockquote>
                <style jsx>{`
                    blockquote {
                        margin: 8px 0 8px 4px;
                        font-size: 15px;
                        border-left-width: 4px;
                        border-left-style: solid;
                        padding-left: 12px;
                        color: ${getStyleForQuote(theme)["color"]};
                        border-left-color: ${getStyleForQuote(theme)["borderColor"]};
                    }
                    blockquote:first-child {
                        margin-top: 0;
                    }
                    blockquote:last-child {
                        margin-bottom: 0;
                    }
                `}</style>
            </>
        )
    }
    if (node.type == "heading_1") {
        return (
            <>
                <h1>{inner}</h1>
                <style jsx>{`
                    h1 {
                        line-height: 1em;
                        font-size: 26px;
                        margin: 16px 0;
                        padding: 0;
                    }
                    h1:first-child {
                        margin-top: 0;
                    }
                    h1:last-child {
                        margin-bottom: 0;
                    }
                `}</style>
            </>
        )
    }
    if (node.type == "heading_2") {
        return (
            <>
                <h2>{inner}</h2>
                <style jsx>{`
                    h2 {
                        line-height: 1em;
                        font-size: 20px;
                        margin: 16px 0;
                        padding: 0;
                    }
                    h2:first-child {
                        margin-top: 0;
                    }
                    h2:last-child {
                        margin-bottom: 0;
                    }
                `}</style>
            </>
        )
    }
    if (node.type == "code") {
        return (
            <div className="__global-message-text-syntax-highlight">
                <SyntaxHighlighter
                    language={node.language}
                    style={monokaiSublime}
                    customStyle={{
                        padding: "20px 20px 20px 0",
                        background: getStyleForSyntaxHighlighting(theme)["backgroundColor"],
                    }}
                    lineNumberStyle={{
                        color: getStyleForSyntaxHighlighting(theme)["lineNumberColor"],
                    }}
                    showLineNumbers>
                    {getCodeContent(textGraphemes, node)}
                </SyntaxHighlighter>
                <style jsx global>{`
                    .__global-message-text-syntax-highlight > pre {
                        margin: 10px 0;
                        border-radius: 10px;
                    }
                    .__global-message-text-syntax-highlight > pre::-webkit-scrollbar {
                        width: 0px;
                        height: 0;
                    }
                `}</style>
            </div>
        )
    }
    if (node.type == "list") {
        return (
            <>
                <ul>{inner}</ul>
            </>
        )
    }
    if (node.type == "listitem") {
        const innterList = node.children.filter((child) => child.type == "list")
        const nested = innterList.length == 0 ? false : true
        return (
            <>
                <li
                    className={classnames({
                        nested,
                    })}>
                    {inner}
                </li>
                <style jsx>{`
                    li.nested {
                        list-style-type: none;
                    }
                `}</style>
            </>
        )
    }
    return null
}

export const StyledTextComponent = ({
    text,
    entities,
    theme,
}: {
    text: string
    entities: MessageObjectT["entities"]
    theme: Themes
}) => {
    const textGraphemes = new GraphemeSplitter().splitGraphemes(text)
    const domList = []
    entities.style.forEach((node: MessageEntityStyleNode, index: number) => {
        const dom = styledNodeToDOM(textGraphemes, node, theme)
        domList.push(React.cloneElement(dom, { key: index }))
    })
    return (
        <>
            {domList}
            <style jsx global>{``}</style>
        </>
    )
}

export const PlainTextComponent = ({
    text,
    entities,
}: {
    text: string
    entities: MessageObjectT["entities"]
}) => {
    return <div>{text}</div>
}

export const TextComponent = React.memo(
    ({ message, domainData, contentAction: chatActions, content, theme }: MessagePropsT) => {
        if (content.options.showMutedMessage === false) {
            const user = domainData.users.get(message.user_id)
            if (user == null) {
                return <div>ユーザーがいません</div>
            }
            if (user.muted) {
                return <div>ミュート中の投稿</div>
            }
        }
        const entities: MessageObjectT["entities"] = {
            channel_groups: message.entities.channel_groups.map((entity) => {
                const channelGroup = domainData.channelGroups.get(entity.channel_group_id)
                return {
                    channel_group_id: entity.channel_group_id,
                    indices: entity.indices,
                    channel_group: channelGroup,
                }
            }),
            channels: message.entities.channels.map((entity) => {
                const channel = domainData.channels.get(entity.channel_id)
                return {
                    channel_id: entity.channel_id,
                    indices: entity.indices,
                    channel: channel,
                }
            }),
            messages: message.entities.messages.map((entity) => {
                const message = domainData.messages.get(entity.message_id)
                return {
                    message_id: entity.message_id,
                    indices: entity.indices,
                    message: message,
                }
            }),
            favorited_users: [],
            favorited_user_ids: [],
            style: message.entities.style,
        }
        if (entities.style.length == 0) {
            return <PlainTextComponent text={message.text} entities={entities} />
        } else {
            return <StyledTextComponent theme={theme} text={message.text} entities={entities} />
        }
    },
    (prevProps: MessagePropsT, nextProps: MessagePropsT) => {
        if (prevProps.theme.global.current.light !== nextProps.theme.global.current.light) {
            return false
        }
        if (prevProps.theme.global.current.dark !== nextProps.theme.global.current.dark) {
            return false
        }
        if (prevProps.message._internal_updated_at !== nextProps.message._internal_updated_at) {
            return false
        }
        const prevStatusUser = prevProps.domainData.users.get(prevProps.message.user_id)
        const nextStatusUser = nextProps.domainData.users.get(nextProps.message.user_id)
        if (prevStatusUser.muted !== nextStatusUser.muted) {
            return false
        }
        if (prevProps.message.text !== nextProps.message.text) {
            return false
        }
        if (
            prevProps.content.options.showMutedMessage !==
            nextProps.content.options.showMutedMessage
        ) {
            return false
        }
        return true
    }
)
