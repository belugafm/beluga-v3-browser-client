import { Response } from "../../../api"
import * as reducers from "../store/reducer_method"

import { UnexpectedResponseError, WebAPIUnavailableResponse } from "../../../api/fetch"

import { ContentActionContext } from "./contents"
import { ContentStateT } from "../store/types/app_state"
import { ReducerContext } from "../store/types/reducer"
import { useContext } from "react"

export const usePostboxAction = ({
    query,
    content,
}: {
    query: Record<string, any>
    content: ContentStateT
}) => {
    const { asyncReducer } = useContext(ReducerContext)
    const contentAction = useContext(ContentActionContext)

    return {
        postMessage: async (text: string, textStyleJson: string) => {
            const sendRequest = async (text: string, textStyleJson: string) => {
                try {
                    return await asyncReducer(
                        reducers.domainData.message.post,
                        Object.assign({}, query, {
                            text: text,
                            textStyle: textStyleJson,
                        })
                    )
                } catch (error) {
                    alert(error)
                    if (error instanceof UnexpectedResponseError) {
                        throw error
                    }
                    return new Response(WebAPIUnavailableResponse)
                }
            }
            const response = await sendRequest(text, textStyleJson)
            if (response.ok) {
                contentAction.appendLatestMessages(content)
                return true
            } else {
                alert(response.description)
                return false
            }
        },
    }
}
