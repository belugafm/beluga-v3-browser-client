import React from "react"
import { CommonPropsT } from "../types"
import LikesComponent from "./likes"
import FavoritesComponent from "./favorites"
import CommentsComponent from "./comments"
import ActionsComponent from "./actions"

export default React.memo(
    (props: CommonPropsT) => {
        const { status } = props
        return (
            <div className="footer">
                <LikesComponent
                    count={status.likes.count}
                    counts={status.likes.counts}
                    domainData={props.domainData}
                />
                <FavoritesComponent
                    count={status.favorites.count}
                    userIds={status.favorites.user_ids}
                    domainData={props.domainData}
                />
                <CommentsComponent count={status.comment_count} domainData={props.domainData} />
                <ActionsComponent {...props} />
            </div>
        )
    },
    (prevProps: CommonPropsT, nextProps: CommonPropsT) => {
        if (prevProps.status.updated_at !== nextProps.status.updated_at) {
            return false
        }
        return true
    }
)
