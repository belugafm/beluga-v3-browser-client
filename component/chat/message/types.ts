import { MessageObjectT, UserObjectT } from "../../../api/object"

import { ContentActionT } from "../../../state/chat/actions/contents"
import { ContentStateT } from "../../../state/chat/store/types/app_state"
import { DeleteMessageModalActionT } from "../../../state/component/model/delete_message"
import { DomainDataT } from "../../../state/chat/store/types/domain_data"
import { MessageActionT } from "../../../state/chat/actions/message"
import { ThemeT } from "../../theme"
import { TooltipActionT } from "../../../state/component/tooltip"

export type MessagePropsT = {
    message: MessageObjectT
    messageAction: MessageActionT
    contentAction: ContentActionT
    tooltipAction: TooltipActionT
    deleteMessageModalAction: DeleteMessageModalActionT
    domainData: DomainDataT
    loggedInUser: UserObjectT
    content: ContentStateT
    isConsecutivePost: boolean
    theme: ThemeT
}
