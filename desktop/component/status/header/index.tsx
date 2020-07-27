import UserComponent from "./user"
import { CommonPropsT } from "../types"
import config from "../../../config"

export default (props: CommonPropsT) => {
    const { status } = props
    return (
        <div>
            <UserComponent {...props} />
            <a href={`${config.server.getBaseUrl()}/status/${status.id}`}>.</a>
        </div>
    )
}
