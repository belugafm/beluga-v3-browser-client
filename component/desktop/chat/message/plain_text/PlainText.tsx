import SyntaxHighlighter from "react-syntax-highlighter"
import { monokaiSublime } from "react-syntax-highlighter/dist/cjs/styles/hljs"
import { ThemeT } from "../../../../theme"
import { ExternalImageComponent, containsImageUrl } from "../styled_text/ExternalImage"
import { containsUrl, LinkComponent } from "../styled_text/Link"
import { CodeComponent } from "./Code"

const flatten = (array: any[]): any[] => {
    return array.reduce((prev, current) => prev.concat(current), [])
}

const splitByUrl = (text: string): string[] => {
    return text
        .split(
            /(https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#\u3000-\u30FE\u4E00-\u9FA0\uFF01-\uFFE3]+)/
        )
        .filter((substr) => substr && substr.length > 0)
}

const splitByImageUrl = (text: string): string[] => {
    return text
        .split(/(https:\/\/.+\.(?:jpeg|jpg|gif|png|webp)(?::[a-z]+)?)/)
        .filter((substr) => substr && substr.length > 0)
}

const splitIntoInlineComponents = (text: string) => {
    let components: any[] = [text]
    components = flatten(components).map((substr) => splitByImageUrl(substr))
    components = flatten(components).map((substr) => splitByUrl(substr))
    return flatten(components)
}

const splitByCode = (text: string): string[] => {
    return text
        .split(/("""[a-zA-Z0-9]*?\n[\s\S]+?\n""")/)
        .filter((substr) => substr && substr.length > 0)
}

const splitIntoMultilineComponents = (text: string): string[] => {
    let components: any[] = [text]
    components = flatten(components).map((substr) => splitByCode(substr))
    return flatten(components)
}

export const PlainTextComponent = ({ text, theme }: { text: string; theme: ThemeT }) => {
    const multilineComponents = splitIntoMultilineComponents(text)
    const elements = multilineComponents.map((block, k) => {
        if (block.indexOf('"""') == 0) {
            return <CodeComponent text={block} theme={theme} />
        } else {
            const lines = block.split("\n").filter((substr) => substr.length > 0)
            return lines.map((line, j) => {
                const components = splitIntoInlineComponents(line)
                const elements = components.map((substr, k) => {
                    if (containsImageUrl(substr)) {
                        return (
                            <ExternalImageComponent href={substr} theme={theme} key={`${j}-${k}`} />
                        )
                    }
                    if (containsUrl(substr)) {
                        return <LinkComponent url={substr} theme={theme} key={`${j}-${k}`} />
                    }
                    return <span key={`${j}-${k}`}>{substr}</span>
                })
                return (
                    <>
                        <p>{elements}</p>
                        <style jsx>{`
                            p {
                                margin: 0;
                                line-height: 1.3em;
                            }
                        `}</style>
                    </>
                )
            })
        }
    })
    return <div>{elements}</div>
}
