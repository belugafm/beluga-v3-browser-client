import SyntaxHighlighter from "react-syntax-highlighter"
import { monokaiSublime } from "react-syntax-highlighter/dist/cjs/styles/hljs"
import { ThemeT } from "../../../../Theme"
import { getStyle } from "../styled_text/Code"

const getLanguage = (text: string) => {
    const m = text.match(/\`\`\`(\S+?)\s/)
    if (m) {
        return m[1]
    } else {
        return undefined
    }
}

const getCodeContent = (text: string) => {
    const m = text.match(/\`\`\`\S*?\s([\s\S]+?)\`\`\`/)
    if (m) {
        return m[1].replace(/^\s+/, "").replace(/\s+$/, "")
    } else {
        return undefined
    }
}

export const CodeComponent = ({ text, theme }: { text: string; theme: ThemeT }) => {
    return (
        <div className="__global-message-text-syntax-highlight">
            <SyntaxHighlighter
                language={getLanguage(text)}
                style={monokaiSublime}
                customStyle={{
                    padding: "20px 20px 20px 0",
                    background: getStyle(theme)["backgroundColor"],
                }}
                lineNumberStyle={{
                    color: getStyle(theme)["lineNumberColor"],
                }}
                showLineNumbers>
                {getCodeContent(text)}
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
