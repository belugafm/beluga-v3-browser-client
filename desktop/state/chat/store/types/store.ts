import { AppStateSetActionT, AppStateT } from "./app_state"
import { DomainDataSetActionT, DomainDataT } from "./domain_data"

export type StoreT = {
    domainData: DomainDataT
    appState: AppStateT
}

export type StoreSetActionsT = {
    domainData: DomainDataSetActionT
    appState: AppStateSetActionT
}
