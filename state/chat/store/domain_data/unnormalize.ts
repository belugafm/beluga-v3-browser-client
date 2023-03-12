import { DomainDataT } from "../types/domain_data"
import { MessageObjectT } from "../../../../api/object"
import deepCopy from "./copy"

export function unnormalizeMessage(
    normalizedMessage: MessageObjectT,
    domainData: DomainDataT
): MessageObjectT {
    const ret = deepCopy.message(normalizedMessage)
    ret.user = domainData.users.get(ret.user_id)
    if (ret.channel_id) {
        ret.channel = domainData.channels.get(ret.channel_id)
    }
    ret.entities.favorited_user_ids.forEach((userId) => {
        const user = domainData.users.get(userId)
        if (user) {
            ret.entities.favorited_users.push(user)
        }
    })
    if (ret.last_reply_message_id) {
        ret.last_reply_message = domainData.messages.get(ret.last_reply_message_id)
        if (ret.last_reply_message) {
            ret.last_reply_message.user = domainData.users.get(ret.last_reply_message.user_id)
        }
    }
    return ret
}

export default {
    message: unnormalizeMessage,
}
