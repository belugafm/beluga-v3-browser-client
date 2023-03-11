import SyntaxHighlighter from "react-syntax-highlighter"
import { monokaiSublime } from "react-syntax-highlighter/dist/cjs/styles/hljs"
import { MessageEntityStyleNode } from "../../../../../api/object"
import { ThemeT } from "../../../../theme"

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

const getStyle = (theme: ThemeT) => {
    if (theme.global.current.light) {
        return {
            lineNumberColor: "#a5aa91",
            backgroundColor: "rgb(35, 36, 31)",
        }
    }
    if (theme.global.current.dark) {
        return {
            lineNumberColor: "#505764",
            backgroundColor: "#0d0e10",
        }
    }
    throw new Error()
}

export const CodeComponent = ({
    textGraphemes,
    node,
    theme,
}: {
    textGraphemes: string[]
    node: MessageEntityStyleNode
    theme: ThemeT
}) => {
    return (
        <div className="__global-message-text-syntax-highlight">
            <SyntaxHighlighter
                language={node.language}
                style={monokaiSublime}
                customStyle={{
                    padding: "20px 20px 20px 0",
                    background: getStyle(theme)["backgroundColor"],
                }}
                lineNumberStyle={{
                    color: getStyle(theme)["lineNumberColor"],
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
