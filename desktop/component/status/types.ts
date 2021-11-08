import { StatusObjectT, UserObjectT } from "../../api/object"

import { ChatActionsT } from "../../state/chat/actions"
import { ColumnStateT } from "../../state/chat/state/app"
import { DomainDataT } from "../../state/chat/state/data/types"
import { StatusActionsT } from "../../state/status"

export type CommonPropsT = {
    status: StatusObjectT
    statusActions: StatusActionsT
    chatActions: ChatActionsT
    domainData: DomainDataT
    loggedInUser: UserObjectT
    column: ColumnStateT
}
