import { StoreT } from "../reducer"
import * as WebAPI from "../../../api"
import { fetch } from "../data"

export const update = async (
    store: StoreT,
    query: Record<string, any>
): Promise<[StoreT, WebAPI.Response]> => {
    const [nextDomainData, response] = await fetch(store.domainData, WebAPI.statuses.update, query)
    const { status } = response
    return [
        {
            domainData: nextDomainData,
            appState: store.appState,
        },
        response,
    ]
}
