import { StatusObjectT, UserObjectT } from "../../api/object"
import { StatusMethodsT } from "../../state/status"
import { DomainDataT } from "../../state/chat/data"

export type CommonPropsT = {
    status: StatusObjectT
    methods: StatusMethodsT
    domainData: DomainDataT
    loggedInUser: UserObjectT
}
