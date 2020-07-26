import React from "react"
import equals from "deep-equal"
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
            <div className="status">
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
        if (equals(prevProps.status, nextProps.status) === false) {
            return false
        }
        const prevUser = prevProps.domainData.users.get(prevProps.status.user_id)
        const nextUser = nextProps.domainData.users.get(nextProps.status.user_id)
        if (equals(prevUser, nextUser) === false) {
            return false
        }
        if (prevProps.domainData.mutedUserIds.equals(nextProps.domainData.mutedUserIds) === false) {
            return false
        }
        if (
            prevProps.domainData.blockedUserIds.equals(nextProps.domainData.blockedUserIds) ===
            false
        ) {
            return false
        }
        if (
            equals(prevProps.status.entities.channels, nextProps.status.entities.channels) === false
        ) {
            return false
        }
        if (
            equals(prevProps.status.entities.statuses, nextProps.status.entities.statuses) === false
        ) {
            return false
        }
        for (let index = 0; index < nextProps.status.entities.channels.length; index++) {
            const prevChannel = prevProps.domainData.channels.get(
                prevProps.status.entities.channels[index].channel_id
            )
            const nextChannel = nextProps.domainData.channels.get(
                nextProps.status.entities.channels[index].channel_id
            )
            if (equals(prevChannel, nextChannel) === false) {
                return false
            }
        }
        for (let index = 0; index < nextProps.status.entities.statuses.length; index++) {
            const prevStatus = prevProps.domainData.statuses.get(
                prevProps.status.entities.statuses[index].status_id
            )
            const nextStatus = nextProps.domainData.statuses.get(
                nextProps.status.entities.statuses[index].status_id
            )
            if (equals(prevStatus, nextStatus) === false) {
                return false
            }
        }
        return true
    }
)
