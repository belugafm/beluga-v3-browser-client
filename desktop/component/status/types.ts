import { StatusObjectT, UserObjectT } from "../../api/object"
import { StatusActionsT } from "../../state/status"
import { DomainDataT } from "../../state/chat/state/data"
import { ChatActionsT } from "../../state/chat"
import { ColumnStateT } from "../../state/chat/state/app"

export type CommonPropsT = {
    status: StatusObjectT
    statusActions: StatusActionsT
    chatActions: ChatActionsT
    domainData: DomainDataT
    loggedInUser: UserObjectT
    column: ColumnStateT
}
