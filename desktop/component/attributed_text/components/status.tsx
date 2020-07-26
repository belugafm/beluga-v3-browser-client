import LinkTextComponent from "./link"
import { StatusObjectT } from "../../../api/object"

type PropTypes = {
    status: StatusObjectT
    url: string
    showOriginalUrl: boolean
    callback: (status: StatusObjectT) => Promise<void>
}

export default (props: PropTypes) => {
    const { url, status, showOriginalUrl, callback } = props
    return (
        <>
            <LinkTextComponent
                href={url}
                hidden={!showOriginalUrl}
                onClick={() => {
                    callback(status)
                }}
            />
            <div>
                <span>{status.text}</span>
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
