import { AttributedTextComponent, defaultOption } from "../../../attributed_text"
import { ChannelObjectT, MessageObjectT, UserObjectT } from "../../../../api/object"

import { CommonPropsT } from "../types"
import React from "react"

export default React.memo(
    ({ message, domainData, contentActions: chatActions, content }: CommonPropsT) => {
        if (content.options.showMutedMessage === false) {
            const user = domainData.users.get(message.user_id)
            if (user.muted) {
                return <div>ミュート中の投稿</div>
            }
        }
        const entities: MessageObjectT["entities"] = {
            channel_groups: [],
            channels: message.entities.channels.map((entity) => {
                const channel = domainData.channels.get(entity.channel_id)
                return {
                    channel_id: entity.channel_id,
                    indices: entity.indices,
                    channel: channel,
                }
            }),
            messages: message.entities.messages.map((entity) => {
                const message = domainData.messages.get(entity.message_id)
                return {
                    message_id: entity.message_id,
                    indices: entity.indices,
                    message: message,
                }
            }),
        }
        return (
            <AttributedTextComponent
                text={message.text}
                entities={entities}
                options={defaultOption}
                callbacks={{
                    handleClickChannel: async (channel: ChannelObjectT) => {
                        chatActions.channel.open(channel, content.id)
                    },
                    handleClickStatus: async (message: MessageObjectT) => {},
                    handleClickUser: async (user: UserObjectT) => {},
                }}
            />
        )
    },
    (prevProps: CommonPropsT, nextProps: CommonPropsT) => {
        if (prevProps.message.updated_at !== nextProps.message.updated_at) {
            return false
        }
        const prevStatusUser = prevProps.domainData.users.get(prevProps.message.user_id)
        const nextStatusUser = nextProps.domainData.users.get(nextProps.message.user_id)
        if (prevStatusUser.muted !== nextStatusUser.muted) {
            return false
        }
        if (prevProps.message.text !== nextProps.message.text) {
            return false
        }
        if (
            prevProps.content.options.showMutedMessage !==
            nextProps.content.options.showMutedMessage
        ) {
            return false
        }
        return true
    }
)
