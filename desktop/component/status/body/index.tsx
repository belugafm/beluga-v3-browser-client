import { CommonPropsT } from "../types"
import { AttributedTextComponent, defaultOption } from "../../attributed_text"
import { StatusObjectT } from "../../../api/object"

export default ({ status, domainData }: CommonPropsT) => {
    const user = domainData.users.get(status.user_id)
    if (user.muted) {
        return <div>ミュート中の投稿</div>
    }
    const entities: StatusObjectT["entities"] = {
        channels: status.entities.channels.map((entity) => {
            const channel = domainData.channels.get(entity.channel_id)
            return {
                channel_id: entity.channel_id,
                indices: entity.indices,
                channel: channel,
            }
        }),
        statuses: status.entities.statuses.map((entity) => {
            const status = domainData.statuses.get(entity.status_id)
            return {
                status_id: entity.status_id,
                indices: entity.indices,
                status: status,
            }
        }),
    }
    return (
        <AttributedTextComponent text={status.text} entities={entities} options={defaultOption} />
    )
}
