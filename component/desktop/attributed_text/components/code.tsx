import SyntaxHighlighter from "react-syntax-highlighter"
import monokai from "./styles/monokai"
import vs2015 from "./styles/vs2015"

type Props = {
    code: string
    language: string
    disableHighlighting: boolean
}

export default (props: Props) => {
    const { code, language, disableHighlighting } = props
    if (disableHighlighting) {
        return (
            <>
                <pre className="attributed-text-code">
                    <code>{code}</code>
                </pre>
                <style jsx>{`
                    pre {
                        background-color: whitesmoke;
                        padding: 8px;
                        overflow: auto;
                        max-height: 600px;
                        border-radius: 6px;
                        white-space: pre;
                    }
                `}</style>
            </>
        )
    } else {
        return (
            <>
                <div className="code">
                    <SyntaxHighlighter
                        language={language}
                        style={vs2015}
                        customStyle={{
                            padding: "10px",
                            borderRadius: "6px",
                        }}>
                        {code.trim()}
                    </SyntaxHighlighter>
                </div>
                <style jsx>{`
                    .code {
                        line-height: 1.4em;
                    }
                `}</style>
            </>
        )
    }
}
