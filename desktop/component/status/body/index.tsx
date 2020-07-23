import { CommonPropsT } from "../types"

export default ({ status, domainData }: CommonPropsT) => {
    const user = domainData.usersById[status.user_id]
    if (user.muted) {
        return <div>ミュート中の投稿</div>
    }
    return <div>{status.text}</div>
}
