import ActionsComponent from "./actions"
import CommentsComponent from "./comments"
import { CommonPropsT } from "../types"
import FavoritesComponent from "./favorites"
import LikesComponent from "./likes"
import React from "react"

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
                    count={status.favorite.count}
                    userIds={status.favorite.user_ids}
                    domainData={props.domainData}
                />
                <CommentsComponent count={status.reply_count} domainData={props.domainData} />
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
