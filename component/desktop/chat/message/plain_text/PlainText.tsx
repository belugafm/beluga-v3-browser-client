import { MessageObjectT } from "../../../../../api/object"
import { ThemeT } from "../../../../theme"
import { ExternalImageComponent, containsImageUrl } from "../styled_text/ExternalImage"
import { containsUrl, LinkComponent } from "../styled_text/Link"

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
export const PlainTextComponent = ({ text, theme }: { text: string; theme: ThemeT }) => {
    const lines = text.split("\n")
    const elements = lines.map((line, j) => {
        const components = splitIntoInlineComponents(line)
        const elements = components.map((substr, k) => {
            if (containsImageUrl(substr)) {
                return <ExternalImageComponent href={substr} theme={theme} key={`${j}-${k}`} />
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
    return <div>{elements}</div>
}
