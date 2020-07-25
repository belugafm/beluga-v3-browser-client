import { CommonPropsT } from "../types"
import { AttributedTextComponent, defaultOption } from "../../attributed_text"
import { StatusObjectT, ChannelObjectT, UserObjectT } from "../../../api/object"

export default ({ status, domainData, chatActions, column }: CommonPropsT) => {
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
        <AttributedTextComponent
            text={status.text}
            entities={entities}
            options={defaultOption}
            callbacks={{
                handleClickChannel: async (channel: ChannelObjectT) => {
                    chatActions.channel.open(channel, column.index + 1)
                },
                handleClickStatus: async (status: StatusObjectT) => {},
                handleClickUser: async (user: UserObjectT) => {},
            }}
        />
    )
}
