import UserComponent from "./user"
import { CommonPropsT } from "../types"

export default (props: CommonPropsT) => {
    return (
        <div>
            <UserComponent {...props} />
        </div>
    )
}
