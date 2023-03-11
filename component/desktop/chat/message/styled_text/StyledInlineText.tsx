import classNames from "classnames"
import { MessageEntityStyleFormat, MessageEntityStyleNode } from "../../../../../api/object"
import { ThemeT } from "../../../../theme"

const hasFormat = (nodeFormat: number, styleFormat: number): boolean => {
    return (nodeFormat & styleFormat) !== 0
}

const getStyle = (theme: ThemeT) => {
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

export const StyledInlineTextCompoment = ({
    text,
    node,
    theme,
}: {
    text: string
    node: MessageEntityStyleNode
    theme: ThemeT
}) => {
    let textDecoration = ""
    if (hasFormat(node.style.format, MessageEntityStyleFormat.STRIKETHROUGH)) {
        textDecoration += "line-through "
    }
    if (hasFormat(node.style.format, MessageEntityStyleFormat.UNDERLINE)) {
        textDecoration += "underline "
    }
    const fontWeight = hasFormat(node.style.format, MessageEntityStyleFormat.BOLD) ? 700 : 400
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
                className={classNames({
                    code: hasFormat(node.style.format, MessageEntityStyleFormat.CODE),
                })}>
                {text}
            </span>
            <style jsx>{`
                span {
                    font-weight: ${fontWeight};
                    font-style: ${fontStyle};
                    text-decoration-line: ${textDecoration};
                }
                span.code {
                    background: ${getStyle(theme)["backgroundColor"]};
                    border-radius: 4px;
                    padding: 2px 6px;
                    margin: 0 4px;
                    font-size: 13px;
                    border: 1px solid ${getStyle(theme)["borderColor"]};
                }
            `}</style>
        </>
    )
}
