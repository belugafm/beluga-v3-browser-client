import { CommonPropsT } from "../types"

export default ({ status }: CommonPropsT) => {
    return <div>{status.text}</div>
}
