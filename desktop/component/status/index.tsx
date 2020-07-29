import React from "react"
import HeaderComponent from "./header"
import BodyComponent from "./body"
import FooterComponent from "./footer"
import { CommonPropsT } from "./types"

export const StatusComponent = React.memo(
    (props: CommonPropsT) => {
        console.info("StatusComponent::render", props.status.id)
        const { status } = props
        if (status.deleted) {
            return null
        }
        return (
            <div className="status" status-id={status.id}>
                <HeaderComponent {...props} />
                <BodyComponent {...props} />
                <FooterComponent {...props} />
                <style jsx>{`
                    .status {
                        min-height: 30px;
                        border-bottom: 1px solid black;
                    }
                `}</style>
            </div>
        )
    },
    (prevProps: CommonPropsT, nextProps: CommonPropsT) => {
        if (prevProps.status.updated_at !== nextProps.status.updated_at) {
            return false
        }
        if (prevProps.status.deleted !== nextProps.status.deleted) {
            return false
        }
        // const prevUser = prevProps.domainData.users.get(prevProps.status.user_id)
        // const nextUser = nextProps.domainData.users.get(nextProps.status.user_id)
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
        if (prevProps.status.text !== nextProps.status.text) {
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
