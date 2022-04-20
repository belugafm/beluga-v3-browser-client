import * as api from "../../../api"
import * as reducers from "../reducer_method"

import { UnexpectedResponseError, WebAPIUnavailableResponse } from "../../../api/fetch"

import { ContentActionContext } from "../store/app_state/action"
import { ContentStateT } from "../store/types/app_state"
import { EditorState } from "draft-js"
import { ReducerContext } from "../store/types/reducer"
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
    const contentAction = useContext(ContentActionContext)

    const post = async (text: string) => {
        try {
            return await reducer(
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
            contentAction.content.loadLatestMessagesIfNeeded(content)
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
