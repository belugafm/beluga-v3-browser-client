import { ThemeT } from "../../../../theme"

export const getStyle = (theme: ThemeT) => {
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

export const containsUrl = (text: string): boolean => {
    return (
        text.match(
            /https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#\u3000-\u30FE\u4E00-\u9FA0\uFF01-\uFFE3]+/
        ) != null
    )
}

export const LinkComponent = ({ url, theme }: { url: string; theme: ThemeT }) => {
    return (
        <>
            <a href={url} target="blank">
                {url}
            </a>
            <style jsx>{`
                a {
                    color: ${getStyle(theme)["color"]};
                    display: block;
                    text-decoration: none;
                }
                a:hover {
                    color: ${getStyle(theme)["color"]};
                    text-decoration: underline;
                }
            `}</style>
        </>
    )
}
