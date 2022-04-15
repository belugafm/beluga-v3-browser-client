import * as api from "../../../api"
import * as reducers from "../reducer_method"

import { AsyncReducerMethodT, ReducerContext } from "../store/reducer"
import { UnexpectedResponseError, WebAPIUnavailableResponse } from "../../../api/fetch"
import { createContext, useContext, useState } from "react"

export const usePostboxState = ({ query }: { query: Record<string, any> }) => {
    const { reducer } = useContext(ReducerContext)

    function reduce<T>(method: AsyncReducerMethodT<T>, query: T): Promise<api.Response | null> {
        return reducer(method, query)
    }

    const post = async (text: string) => {
        try {
            return await reduce(
                reducers.domainData.message.post,
                Object.assign({}, query, {
                    text: text,
                })
            )
        } catch (error) {
            if (error instanceof UnexpectedResponseError) {
                throw error
            }
            return new api.Response(WebAPIUnavailableResponse)
        }
    }

    const handlePostMessage = async (text: string) => {
        const response = await post(text)
        if (response.ok) {
        } else {
        }
    }

    const handleError = (response: api.Response) => {}

    return {
        handlePostMessage,
    }
}
