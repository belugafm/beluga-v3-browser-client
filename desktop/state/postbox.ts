import { useState, createContext } from "react"
import * as WebAPI from "../api"
import {
    WebAPIUnavailableResponse,
    UnexpectedResponseError,
} from "../api/classes"

export const usePostboxState = (channelId) => {
    const [textField, setTextField] = useState({
        errorMessage: [],
        value: "",
    })

    const handleUpdateTextValue = (
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setTextField({
            errorMessage: textField.errorMessage,
            value: event.target.value,
        })
    }

    const update = async () => {
        try {
            return await WebAPI.statuses.update({
                text: textField.value,
                channel_id: channelId,
            })
        } catch (error) {
            if (error instanceof UnexpectedResponseError) {
                throw error
            }
            return new WebAPI.Response(WebAPIUnavailableResponse)
        }
    }

    const handleUpdate = async (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        event.preventDefault()
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
        handleUpdateTextValue,
        handleUpdate,
    }
}

const context = {
    textField: {
        errorMessage: [],
        value: "",
    },
    handleUpdateTextValue: null,
    handleUpdate: null,
}

export const PostboxContext = createContext(context)
