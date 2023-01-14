import * as api from "../../api"

import { MessageObjectT } from "../../api/object"

import useSWR from "swr"
import { MessageSearchQueryT } from "../../api/methods/messages"

type ReturnT = {
    messages: MessageObjectT[] | null
    errors: any[]
    isLoading: boolean
}

export const swrFetchData = (query: MessageSearchQueryT): ReturnT => {
    for (const key of Object.keys(query)) {
        if (query[key] == null) {
            delete query[key]
        }
    }
    // @ts-ignore
    const key = new URLSearchParams(query).toString()
    const { data, error } = useSWR(key, () => {
        return api.messages.search(query)
    })
    return {
        messages: data ? data.messages : null,
        errors: [error],
        isLoading: data == null,
    }
}
