import { StatusObjectT } from "../../../api/object"
import { CommonPropsT } from "../types"

export default ({ status, methods, domainData }: CommonPropsT) => {
    const user = domainData.users.get(status.user_id)
    return <div>@{user.name}</div>
}
