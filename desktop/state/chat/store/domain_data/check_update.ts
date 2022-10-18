import { MessageObjectT } from "../../../../api/object"
import { DomainDataT } from "../types/domain_data"

export function messageUpdated(message: MessageObjectT, domainData: DomainDataT): boolean {
    const oldMessage = domainData.messages.get(message.id)
    if (oldMessage == null) {
        return false
    }
    if (message.like_count != oldMessage.like_count) {
        return true
    }
    if (message.favorite_count != oldMessage.favorite_count) {
        return true
    }
    if (message.favorited != oldMessage.favorited) {
        return true
    }
    if (message.reply_count != oldMessage.reply_count) {
        return true
    }
    if (message.deleted != oldMessage.deleted) {
        return true
    }
    if (message.text != oldMessage.text) {
        return true
    }
    return false
}
