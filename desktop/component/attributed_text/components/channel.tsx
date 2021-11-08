import { ChannelObjectT } from "../../../api/object"
import LinkTextComponent from "./link"

type PropTypes = {
    channel: ChannelObjectT
    url: string
    showOriginalUrl: boolean
    callback: (channel: ChannelObjectT) => Promise<void>
}

export default (props: PropTypes) => {
    const { url, channel, showOriginalUrl, callback } = props
    return (
        <>
            <LinkTextComponent
                href={url}
                hidden={!showOriginalUrl}
                onClick={() => {
                    callback(channel)
                }}
            />
            <div>
                <a
                    href={url}
                    onClick={(event) => {
                        event.preventDefault()
                        callback(channel)
                    }}>
                    <span>#</span>
                    <span>{channel.name}</span>
                </a>
            </div>
            <style jsx>{`
                div {
                    border: 1px solid black;
                    border-radius: 6px;
                    padding: 6px;
                }
            `}</style>
        </>
    )
}
