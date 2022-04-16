import * as api from "../../../api"
import * as reducers from "../reducer_method"

import { AsyncReducerMethodT, ReducerContext } from "../store/types/reducer"
import { UnexpectedResponseError, WebAPIUnavailableResponse } from "../../../api/fetch"

import { ContentActionContext } from "../store/app_state/action"
import { ContentStateT } from "../store/app_state"
import { EditorState } from "draft-js"
import { useContext } from "react"

export const usePostboxState = ({
    query,
    content,
}: {
    query: Record<string, any>
    content: ContentStateT
    editorState: EditorState
}) => {
    const { reducer } = useContext(ReducerContext)
    const contentActions = useContext(ContentActionContext)

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
            contentActions.content.loadLatestMessagesIfNeeded(content)
            return true
        } else {
            return false
        }
    }

    const handleError = (response: api.Response) => {}

    return {
        handlePostMessage,
    }
}
