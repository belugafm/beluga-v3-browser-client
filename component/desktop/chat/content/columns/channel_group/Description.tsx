import React from "react"
import { ThemeT } from "../../../../../theme"

const getStyle = (theme: ThemeT) => {
    if (theme.global.current.light) {
        return {
            color: "#2a85ff",
            hoverColor: "#2a85ff",
        }
    }
    if (theme.global.current.dark) {
        return {
            color: "#2a85ff",
            hoverColor: "#2a85ff",
        }
    }
    throw new Error()
}

const isUrl = (text: string): boolean => {
    return (
        text.match(
            /https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#\u3000-\u30FE\u4E00-\u9FA0\uFF01-\uFFE3]+/
        ) != null
    )
}

export const DescriptionComponent = ({ text, theme }: { text?: string; theme: ThemeT }) => {
    if (text == null) {
        return null
    }
    const lines = text.split("\n")
    const components = lines.map((line, index) => {
        if (isUrl(line)) {
            return (
                <>
                    <p key={index}>
                        <a href={line}>{line}</a>
                    </p>
                    <style jsx>{`
                        p {
                            margin: 0;
                            min-height: 1.5em;
                            line-height: 1.5em;
                        }
                        a {
                            color: ${getStyle(theme)["color"]};
                        }
                        a:hover {
                            color: ${getStyle(theme)["color"]};
                        }
                    `}</style>
                </>
            )
        }
        return (
            <>
                <p key={index}>{line}</p>
                <style jsx>{`
                    p {
                        margin: 0;
                        min-height: 1.5em;
                        line-height: 1.5em;
                    }
                `}</style>
            </>
        )
    })
    return <div>{components}</div>
}
