import { Fragment } from "react"

type Props = {
    text: string
    detectAsciiArt: boolean
}

const isAsciiArt = (text: string) => {
    if (text.indexOf(" 　") !== -1) {
        return true
    }
    if (text.indexOf("　 ") !== -1) {
        return true
    }
    return false
}

export default ({ text, detectAsciiArt }: Props) => {
    const lines = text.split("\n")
    if (detectAsciiArt && lines.length > 3) {
        // 簡易的なAA判定
        if (isAsciiArt(text)) {
            return (
                <>
                    <div>
                        <pre>{text}</pre>
                    </div>
                    <style jsx>{`
                        div {
                            overflow: auto;
                        }
                        pre {
                            background-color: transparent;
                            font-family: "aahub_light";
                            white-space: pre;
                            font-size: 12px;
                            line-height: 12px;
                        }
                    `}</style>
                </>
            )
        }
    }
    return (
        <>
            {lines.map((text, index) => (
                <Fragment key={index}>
                    <span>{text}</span>
                    {index < lines.length - 1 ? <br /> : null}
                </Fragment>
            ))}
        </>
    )
}
