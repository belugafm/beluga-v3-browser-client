import { CommonPropsT } from "../types"
import LikesComponent from "./likes"
import FavoritesComponent from "./favorites"
import ActionsComponent from "./actions"

export default (props: CommonPropsT) => {
    const { status } = props
    return (
        <div className="footer">
            <LikesComponent
                count={status.likes.count}
                counts={status.likes.counts}
                domainData={props.domainData}
            />
            <FavoritesComponent count={status.favorites.count} users={status.favorites.users} />
            <ActionsComponent {...props} />
        </div>
    )
}
