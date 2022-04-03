import BodyComponent from "./body"
import { CommonPropsT } from "./types"
import React from "react"

export const MessageComponent = React.memo(
    (props: CommonPropsT) => {
        console.info("StatusComponent::render", props.message.id)
        const { message } = props
        if (message.deleted) {
            return null
        }
        return (
            <div className="message" message-id={message.id}>
                <BodyComponent {...props} />
                <style jsx>{`
                    .message {
                        min-height: 30px;
                        border-bottom: 1px solid black;
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
            prevProps.column.options.showMutedStatuses !==
            nextProps.column.options.showMutedStatuses
        ) {
            return false
        }
        return true
    }
)
