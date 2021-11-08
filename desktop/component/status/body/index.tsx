import { AttributedTextComponent, defaultOption } from "../../attributed_text"
import { ChannelObjectT, StatusObjectT, UserObjectT } from "../../../api/object"

import { CommonPropsT } from "../types"
import React from "react"

export default React.memo(
    ({ status, domainData, chatActions, column }: CommonPropsT) => {
        if (column.options.showMutedStatuses === false) {
            const user = domainData.users.get(status.user_id)
            if (user.muted) {
                return <div>ミュート中の投稿</div>
            }
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
                        chatActions.channel.open(channel, column.id)
                    },
                    handleClickStatus: async (status: StatusObjectT) => {},
                    handleClickUser: async (user: UserObjectT) => {},
                }}
            />
        )
    },
    (prevProps: CommonPropsT, nextProps: CommonPropsT) => {
        if (prevProps.status.updated_at !== nextProps.status.updated_at) {
            return false
        }
        const prevStatusUser = prevProps.domainData.users.get(prevProps.status.user_id)
        const nextStatusUser = nextProps.domainData.users.get(nextProps.status.user_id)
        if (prevStatusUser.muted !== nextStatusUser.muted) {
            return false
        }
        if (prevProps.status.text !== nextProps.status.text) {
            return false
        }
        if (
            prevProps.column.options.showMutedStatuses !==
            nextProps.column.options.showMutedStatuses
        ) {
            return false
        }
        return true
    }
)
