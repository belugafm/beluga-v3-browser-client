import { AttributedTextType } from "../parser"

type Props = {
    type: string
    children: any
}
export default (props: Props) => {
    const { type, children } = props
    if (type === AttributedTextType.MarkdownBig) {
        return <span style={{ fontSize: "24px" }}>{children}</span>
    }
    if (type === AttributedTextType.MarkdownBold) {
        return <span style={{ fontWeight: "bold" }}>{children}</span>
    }
    if (type === AttributedTextType.MarkdownItalic) {
        return <span style={{ fontStyle: "italic" }}>{children}</span>
    }
    if (type === AttributedTextType.MarkdownStrikethrough) {
        return <span style={{ textDecoration: "line-through" }}>{children}</span>
    }
    if (type === AttributedTextType.MarkdownUnderline) {
        return <span style={{ textDecoration: "underline" }}>{children}</span>
    }
    return null
}
