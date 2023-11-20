import { ThemeT } from "../../../../Theme"
import { getStyle } from "./Link"

export const containsImageUrl = (text: string): boolean => {
    return text.match(/https:\/\/.+\.(jpeg|jpg|gif|png|webp)(\?\S+)?$/) != null
}

export const ExternalImageComponent = ({ href, theme }: { href: string; theme: ThemeT }) => {
    const urlWithoutQuery = href.split("?")[0]
    return (
        <>
            <a href={href} target="blank">
                {urlWithoutQuery}
            </a>
            <img src={href} />
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
                img {
                    max-width: 50%;
                    margin: 8px 0 8px 0;
                    border-radius: 8px;
                }
            `}</style>
        </>
    )
}
