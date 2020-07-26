import React from "react"
import HeaderComponent from "./header"
import BodyComponent from "./body"
import FooterComponent from "./footer"
import { CommonPropsT } from "./types"
import { StatusObjectT } from "../../api/object"

function equalStatus(a: StatusObjectT, b: StatusObjectT): boolean {
    if (a.text !== b.text) {
        return true
    }
    if (a.edited !== b.edited) {
        return true
    }
    if (a.comment_count !== b.comment_count) {
        return true
    }
    if (a.likes.count !== b.likes.count) {
        return true
    }
    if (a.favorites.count !== b.favorites.count) {
        return true
    }
}

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
        if (prevProps.status.updated_at !== nextProps.status.updated_at) {
            return false
        }
        if (prevProps.status.deleted !== nextProps.status.deleted) {
            return false
        }
        const prevUser = prevProps.domainData.users.get(prevProps.status.user_id)
        const nextUser = nextProps.domainData.users.get(nextProps.status.user_id)
        if (prevUser.last_activity_time !== nextUser.last_activity_time) {
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
        for (let index = 0; index < nextProps.status.entities.channels.length; index++) {
            const prevChannel = prevProps.domainData.channels.get(
                prevProps.status.entities.channels[index].channel_id
            )
            const nextChannel = nextProps.domainData.channels.get(
                nextProps.status.entities.channels[index].channel_id
            )
            if (prevChannel.updated_at !== nextChannel.updated_at) {
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
            if (prevStatus.updated_at !== nextStatus.updated_at) {
                return false
            }
        }
        return true
    }
)
