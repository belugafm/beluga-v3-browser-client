import LinkTextComponent from "./link"
import TweetComponent from "react-tweet-embed"

type PropTypes = {
    url: string
    showOriginalUrl: boolean
}

export default (props: PropTypes) => {
    const { url, showOriginalUrl } = props
    const match = url.match(
        /^https?:\/\/(mobile\.)?twitter\.com\/([a-zA-Z0-9_]+)\/status\/([0-9]+)/
    )
    if (match) {
        if (typeof window === "undefined") {
            return null // SSRでiframeを表示させるとバグる
        }
        const status_id = match[3]
        return (
            <>
                <LinkTextComponent href={url} hidden={!showOriginalUrl} />
                <TweetComponent id={status_id} className="tweet" />
            </>
        )
    }
    return <LinkTextComponent href={url} hidden={!showOriginalUrl} />
}
