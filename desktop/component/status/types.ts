import { StatusObjectT, UserObjectT } from "../../api/object"
import { StatusActionsT } from "../../state/status"
import { ChatActionsT } from "../../state/chat"
import { ColumnStateT } from "../../state/chat/state/app"
import { DomainDataT } from "../../state/chat/state/data/types"

export type CommonPropsT = {
    status: StatusObjectT
    statusActions: StatusActionsT
    chatActions: ChatActionsT
    domainData: DomainDataT
    loggedInUser: UserObjectT
    column: ColumnStateT
}
