import { Fragment } from "react"
import LinkTextComponent from "./link"
import qs from "querystring"

const detectVideoIdAndQuery = (url: string) => {
    const ret = {
        videoId: null,
        queryString: null,
    }
    if (url.indexOf("://youtu.be/") !== -1) {
        const match = url.match(/youtu\.be\/([0-9a-zA-Z_\-]+)/)
        if (match === null) {
            return ret
        }
        const videoId = match[1]
        const components = url.split("?")
        if (components.length != 2) {
            return {
                videoId: videoId,
                queryString: "",
            }
        }
        const query = qs.parse(components[1])
        if (query["t"]) {
            query["start"] = query["t"]
            delete query["t"]
        }
        const queryString = qs.stringify(query)

        return { videoId, queryString }
    } else {
        const components = url.split("?")
        if (components.length != 2) {
            return ret
        }
        const query = qs.parse(components[1])
        if (!!query["v"] === false) {
            return ret
        }
        if (query["t"]) {
            query["start"] = query["t"]
            delete query["t"]
        }
        const videoId = query["v"]
        const queryString = qs.stringify(query)
        return { videoId, queryString }
    }
}

type PropTypes = {
    url: string
    showOriginalUrl: boolean
}

export default (props: PropTypes) => {
    const { url, showOriginalUrl: show_original_url } = props
    const { videoId, queryString } = detectVideoIdAndQuery(url)
    if (videoId === null) {
        return <LinkTextComponent href={url} hidden={!show_original_url} />
    }
    return (
        <Fragment>
            <LinkTextComponent href={url} hidden={!show_original_url} />
            <div className="container attributed-text-youtube-container">
                <iframe
                    src={`https://www.youtube.com/embed/${videoId}?${queryString}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
            <style jsx>{`
                .container {
                    height: 0;
                    padding-bottom: 56%;
                    position: relative;
                    margin: 4px 0;
                }
                iframe {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    left: 0;
                    top: 0;
                }
            `}</style>
        </Fragment>
    )
}
