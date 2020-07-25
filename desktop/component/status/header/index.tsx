import UserComponent from "./user"
import { CommonPropsT } from "../types"
import config from "../../../config"

export default (props: CommonPropsT) => {
    const { status } = props
    return (
        <div>
            <UserComponent {...props} />
            <a href={`${config.server.get_base_url()}/status/${status.id}`}>.</a>
        </div>
    )
}
