import GraphemeSplitter from "grapheme-splitter"
import { ThemeT } from "../../../../Theme"
import { getStyle } from "./Link"

const LinkComponent = ({ text, theme }: { text: string; theme: ThemeT }) => {
    return (
        <a href={`/search?text=${text}`}>
            <span>{`?${text}`}</span>
            <style jsx>{`
                a {
                    color: ${getStyle(theme)["color"]};
                    text-decoration: none;
                }
                a:hover {
                    color: ${getStyle(theme)["color"]};
                    text-decoration: underline;
                }
            `}</style>
        </a>
    )
}

export const containsSearchText = (text: string) => {
    return text.match(/^\?([^\s\?]+)|\s+\?([^\s\?]+)+/) != null
}

export const SearchTextComponent = ({ text, theme }: { text: string; theme: ThemeT }) => {
    const results = [...text.matchAll(/^\?([^\s\?]+)|\s+\?([^\s\?]+)/g)]
    if (results.length == 0) {
        return <span>{text}</span>
    }
    const elements = []
    const textGraphemes = new GraphemeSplitter().splitGraphemes(text)
    let cursor = 0
    for (const result of results) {
        const start = result.index
        if (start > cursor) {
            const plainText = textGraphemes.slice(cursor, start).join("")
            elements.push(<span>{plainText}</span>)
        }
        const matchedString = result[1] || result[2]
        const offset = result[1] ? 1 : 2
        const matchedStringGraphemes = new GraphemeSplitter().splitGraphemes(matchedString)
        const prefixText = textGraphemes.slice(start, start + offset - 1).join("")
        if (prefixText.length > 0) {
            elements.push(<span>{prefixText}</span>)
        }
        const searchText = textGraphemes
            .slice(start + offset, start + matchedStringGraphemes.length + offset)
            .join("")
        elements.push(<LinkComponent text={searchText} theme={theme} key={start} />)
        cursor = start
    }
    return <>{elements}</>
}
