import { MessageObjectT, UserObjectT } from "../../api/object"

import { ChatActionsT } from "../../state/chat/store/actions"
import { ColumnStateT } from "../../state/chat/store/app_state"
import { DomainDataT } from "../../state/chat/store/domain_data/types"
import { MessageActionsT } from "../../state/chat/components/message"

export type CommonPropsT = {
    message: MessageObjectT
    messageActions: MessageActionsT
    chatActions: ChatActionsT
    domainData: DomainDataT
    loggedInUser: UserObjectT
    column: ColumnStateT
}
