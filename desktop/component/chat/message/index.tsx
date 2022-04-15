import { Themes, useTheme } from "../../theme"

import BodyComponent from "./body"
import { CommonPropsT } from "./types"
import React from "react"

const getStyle = (theme: Themes) => {
    if (theme.global.current.light) {
        return {
            backgroundColor: "transparent",
            hoverBackgroundColor: "#f4f4f4",
        }
    }
    if (theme.global.current.dark) {
        return {
            backgroundColor: "transparent",
            hoverBackgroundColor: "#111315",
        }
    }
    throw new Error()
}

export const MessageComponent = React.memo(
    (props: CommonPropsT) => {
        console.info("StatusComponent::render", props.message.id)
        const { message } = props
        if (message.deleted) {
            return null
        }
        const [theme] = useTheme()
        return (
            <div className="message" message-id={message.id}>
                <div className="inner">
                    <div className="message-left">
                        <div className="avatar"></div>
                    </div>
                    <div className="message-content">
                        <div className="sender"></div>
                        <div className="text">
                            <BodyComponent {...props} />
                        </div>
                    </div>
                </div>
                <style jsx>{`
                    .message {
                        flex: 0 0 auto;
                        min-height: 30px;
                        cursor: pointer;
                        padding: 4px 0;
                    }
                    .inner {
                        display: flex;
                        flex-direction: row;
                        padding: 0 16px;
                    }
                `}</style>
                <style jsx>{`
                    .message {
                        background-color: ${getStyle(theme)["backgroundColor"]};
                    }
                    .message:hover {
                        background-color: ${getStyle(theme)["hoverBackgroundColor"]};
                    }
                `}</style>
            </div>
        )
    },
    (prevProps: CommonPropsT, nextProps: CommonPropsT) => {
        if (prevProps.message.updated_at !== nextProps.message.updated_at) {
            return false
        }
        if (prevProps.message.deleted !== nextProps.message.deleted) {
            return false
        }
        // const prevUser = prevProps.domainData.users.get(prevProps.message.user_id)
        // const nextUser = nextProps.domainData.users.get(nextProps.message.user_id)
        // if (prevUser.last_activity_time !== nextUser.last_activity_time) {
        //     return false
        // }
        if (prevProps.domainData.mutedUserIds.equals(nextProps.domainData.mutedUserIds) === false) {
            return false
        }
        if (
            prevProps.domainData.blockedUserIds.equals(nextProps.domainData.blockedUserIds) ===
            false
        ) {
            return false
        }
        if (prevProps.message.text !== nextProps.message.text) {
            return false
        }
        if (
            prevProps.content.options.showMutedMessage !==
            nextProps.content.options.showMutedMessage
        ) {
            return false
        }
        return true
    }
)
