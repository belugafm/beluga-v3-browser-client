import { ThemeT } from "../../../../Theme"

const flatten = (array: any[]): any[] => {
    return array.reduce((prev, current) => prev.concat(current), [])
}

const splitByStrongTag = (text: string): string[] => {
    return text.split(/(\*\*.+?\*\*)/).filter((substr) => substr && substr.length > 0)
}

const splitByStrikethrough = (text: string): string[] => {
    return text.split(/(~~.+?~~)/).filter((substr) => substr && substr.length > 0)
}

const splitByInlineCode = (text: string): string[] => {
    return text.split(/(`.+?`)/).filter((substr) => substr && substr.length > 0)
}

const splitIntoInlineComponents = (text: string) => {
    let components: any[] = [text]
    components = flatten(components).map((substr) => splitByStrikethrough(substr))
    components = flatten(components).map((substr) => splitByStrongTag(substr))
    components = flatten(components).map((substr) => splitByInlineCode(substr))
    return flatten(components)
}

export const InlineMarkdownTextComponent = ({ text, theme }: { text: string; theme: ThemeT }) => {
    const lines = text.split("\n").filter((substr) => substr.length > 0)
    const elements = lines.map((line, j) => {
        return splitIntoInlineComponents(line).map((substr, k) => {
            var m = substr.match(/~~(.+?)~~/)
            if (m) {
                return (
                    <>
                        <span key={j}>{m[1]}</span>
                        <style jsx>{`
                            span {
                                text-decoration-line: line-through;
                            }
                        `}</style>
                    </>
                )
            }
            m = substr.match(/\*\*(.+?)\*\*/)
            if (m) {
                return (
                    <>
                        <span key={j}>{m[1]}</span>
                        <style jsx>{`
                            span {
                                font-weight: bold;
                            }
                        `}</style>
                    </>
                )
            }
            m = substr.match(/`(.+?)`/)
            if (m) {
                return (
                    <>
                        <code key={j}>{m[1]}</code>
                        <style jsx>{`
                            code {
                                border-radius: 5px;
                                margin: 0;
                                font-size: 85%;
                                white-space: break-spaces;
                                background-color: rgba(129, 129, 129, 0.2);
                                padding: 0.2em 0.4em;
                                font: 12px Monaco, Consolas, "Andale  Mono", "DejaVu Sans Mono",
                                    monospace;
                            }
                        `}</style>
                    </>
                )
            }
            return <span key={j}>{substr}</span>
        })
    })
    return <>{elements}</>
}
