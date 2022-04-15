import { MessageObjectT, UserObjectT } from "../../../api/object"

import { ActionT } from "../../../state/chat/store/action"
import { ContentStateT } from "../../../state/chat/store/app_state"
import { DomainDataT } from "../../../state/chat/store/domain_data/types"
import { MessageActionT } from "../../../state/chat/components/message"

export type CommonPropsT = {
    message: MessageObjectT
    messageActions: MessageActionT
    chatActions: ActionT
    domainData: DomainDataT
    loggedInUser: UserObjectT
    content: ContentStateT
}
