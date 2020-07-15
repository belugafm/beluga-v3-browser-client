import { CommonPropsT } from "../types"
import LikesComponent from "./likes"
import ActionsComponent from "./actions"

export default (props: CommonPropsT) => {
    const { status } = props
    return (
        <div className="footer">
            <LikesComponent count={status.likes.count} users={status.likes.users} />
            <ActionsComponent {...props} />
        </div>
    )
}
