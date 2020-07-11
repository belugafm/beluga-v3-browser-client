import { useState, createContext, useContext } from "react"
import * as WebAPI from "../api"
import {
    WebAPIUnavailableResponse,
    UnexpectedResponseError,
} from "../api/classes"
import { ChatReducerContext } from "./chat/reducer"
import { ChatDomainDataContext } from "./chat/data"
import { ChatAppStateContext } from "./chat/app"
import * as reducers from "./chat/reducers"

export const usePostboxState = ({ query }: { query: Record<string, any> }) => {
    const domainData = useContext(ChatDomainDataContext)
    const appState = useContext(ChatAppStateContext)
    const { reducer } = useContext(ChatReducerContext)

    const [textField, setTextField] = useState({
        errorMessage: [],
        value: "",
    })

    const updateTextValue = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTextField({
            errorMessage: textField.errorMessage,
            value: event.target.value,
        })
    }

    const update = async () => {
        try {
            return await reducer(
                { domainData, appState },
                reducers.statuses.update,
                Object.assign({}, query, {
                    text: textField.value,
                })
            )
        } catch (error) {
            if (error instanceof UnexpectedResponseError) {
                throw error
            }
            return new WebAPI.Response(WebAPIUnavailableResponse)
        }
    }

    const updateStatus = async () => {
        const response = await update()
        if (response.ok) {
            setTextField({
                errorMessage: [],
                value: "",
            })
        } else {
            handleError(response)
        }
    }

    const handleError = (response: WebAPI.Response) => {}

    return {
        textField,
        updateTextValue,
        updateStatus,
    }
}

const context = {
    textField: {
        errorMessage: [],
        value: "",
    },
    updateTextValue: null,
    updateStatus: null,
}

export const PostboxContext = createContext(context)
