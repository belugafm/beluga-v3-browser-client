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
        return true
    }
)
