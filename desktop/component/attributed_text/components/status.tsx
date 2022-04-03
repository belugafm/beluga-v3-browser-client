import LinkTextComponent from "./link"
import { MessageObjectT } from "../../../api/object"
import React from "react"

type Props = {
    status: MessageObjectT
    url: string
    showOriginalUrl: boolean
    callback: (status: MessageObjectT) => Promise<void>
}

export default React.memo(
    (props: Props) => {
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
    },
    (prevProps: Props, nextProps: Props) => {
        if (prevProps.status.text !== nextProps.status.text) {
            return false
        }
        return true
    }
)
