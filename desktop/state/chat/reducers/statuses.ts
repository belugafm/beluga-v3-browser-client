import { StoreDataT } from "../reducer"
import * as WebAPI from "../../../api"
import { fetch } from "../data"

export const update = async (
    store: StoreDataT,
    query: Record<string, any>
): Promise<[StoreDataT, WebAPI.Response]> => {
    const [nextDomainData, response] = await fetch(
        store.domainData,
        WebAPI.statuses.update,
        query
    )
    const { status } = response
    return [
        {
            domainData: nextDomainData,
            appState: store.appState,
        },
        response,
    ]
}
