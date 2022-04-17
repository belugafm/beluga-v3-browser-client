import { MessageObjectT, UserObjectT } from "../../../api/object"

import { ActionT } from "../../../state/chat/store/app_state/action"
import { ContentStateT } from "../../../state/chat/store/types/app_state"
import { DomainDataT } from "../../../state/chat/store/types/domain_data"
import { MessageActionT } from "../../../state/chat/components/message"
import { Themes } from "../../theme"

export type CommonPropsT = {
    message: MessageObjectT
    messageActions: MessageActionT
    contentActions: ActionT
    domainData: DomainDataT
    loggedInUser: UserObjectT
    content: ContentStateT
    isConsecutivePost: boolean
    theme: Themes
}
