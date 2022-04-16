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
    return ret
}

export default {
    message: unnormalizeMessage,
}
