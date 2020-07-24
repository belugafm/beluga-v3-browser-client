import React from "react"
import { UserObjectT } from "../../api/object"
import equals from "deep-equal"
import HeaderComponent from "./header"
import BodyComponent from "./body"
import FooterComponent from "./footer"
import { CommonPropsT } from "./types"

const StatusLikesComponent = ({ count, users }: { count: number; users: UserObjectT[] }) => {
    if (count == 0) {
        return null
    }
    const components = []
    for (let index = 0; index < count; index++) {
        components.push(<span key={index}>★</span>)
    }
    return (
        <div className="likes">
            {components}
            <style jsx>{`
                .likes {
                }
            `}</style>
        </div>
    )
}

export const StatusComponent = React.memo(
    (props: CommonPropsT) => {
        console.info("StatusComponent::render")
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
        if (prevProps.domainData.users.lastModified !== nextProps.domainData.users.lastModified) {
            return false
        }
        return true
    }
)
