import { ThemeT } from "../../../../theme"

const getStyle = (theme: ThemeT) => {
    if (theme.global.current.light) {
        return {
            borderColor: "#aaaaaa",
            color: "#828282",
        }
    }
    if (theme.global.current.dark) {
        return {
            borderColor: "#969696",
            color: "#a0a0a0",
        }
    }
    throw new Error()
}

export const QuoteComponent = ({ children, theme }: { children: any; theme: ThemeT }) => {
    return (
        <>
            <blockquote>{children}</blockquote>
            <style jsx>{`
                blockquote {
                    margin: 8px 0 8px 4px;
                    font-size: 15px;
                    border-left-width: 4px;
                    border-left-style: solid;
                    padding-left: 12px;
                    color: ${getStyle(theme)["color"]};
                    border-left-color: ${getStyle(theme)["borderColor"]};
                }
                blockquote:first-child {
                    margin-top: 0;
                }
                blockquote:last-child {
                    margin-bottom: 0;
                }
            `}</style>
        </>
    )
}
