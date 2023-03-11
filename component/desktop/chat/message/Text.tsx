import { MessageObjectT } from "../../../../api/object"

import { MessagePropsT } from "./types"
import React from "react"
import { PlainTextComponent } from "./plain_text/PlainText"
import { StyledTextComponent } from "./styled_text/StyledText"

export const TextComponent = React.memo(
    ({ message, domainData, contentAction: chatActions, content, theme }: MessagePropsT) => {
        if (content.options.showMutedMessage === false) {
            const user = domainData.users.get(message.user_id)
            if (user == null) {
                return <div>ユーザーがいません</div>
            }
            if (user.muted) {
                return <div>ミュート中の投稿</div>
            }
        }
        const entities: MessageObjectT["entities"] = {
            channel_groups: message.entities.channel_groups.map((entity) => {
                const channelGroup = domainData.channelGroups.get(entity.channel_group_id)
                return {
                    channel_group_id: entity.channel_group_id,
                    indices: entity.indices,
                    channel_group: channelGroup,
                }
            }),
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
            files: message.entities.files,
            favorited_users: [],
            favorited_user_ids: [],
            style: message.entities.style,
        }
        if (entities.style.length == 0) {
            return <PlainTextComponent text={message.text} theme={theme} />
        } else {
            return <StyledTextComponent text={message.text} entities={entities} theme={theme} />
        }
    },
    (prevProps: MessagePropsT, nextProps: MessagePropsT) => {
        if (prevProps.theme.global.current.light !== nextProps.theme.global.current.light) {
            return false
        }
        if (prevProps.theme.global.current.dark !== nextProps.theme.global.current.dark) {
            return false
        }
        // if (prevProps.message._internal_updated_at !== nextProps.message._internal_updated_at) {
        //     return false
        // }
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
