import * as api from "../../api"

import { UnexpectedResponseError, WebAPIUnavailableResponse } from "../../api/fetch"
import { createContext, useState } from "react"

export const useCreateChannelGroupFormState = (parentId: number) => {
    const initialState = {
        errorMessage: [],
        hint: [],
        value: "",
    }

    const [nameField, setNameField] = useState(initialState)
    const [globalErrorMessageField, setGlobalErrorMessageField] = useState({
        errorMessage: [],
        hint: [],
    })

    const handleUpdateNameValue = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNameField({
            errorMessage: nameField.errorMessage,
            hint: nameField.hint,
            value: event.target.value,
        })
    }

    const create = async () => {
        try {
            return await api.channelGroup.create({
                name: nameField.value,
                parentId: parentId,
            })
        } catch (error) {
            if (error instanceof UnexpectedResponseError) {
                throw error
            }
            return new api.Response(WebAPIUnavailableResponse)
        }
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const response = await create()
        if (response.ok) {
            setGlobalErrorMessageField({
                errorMessage: [],
                hint: [],
            })
            setNameField({
                errorMessage: [],
                hint: [],
                value: nameField.value,
            })
            const group = response.channel_group
            if (group) {
                location.href = `/group/${group.unique_name}`
            }
        } else {
            handleError(response)
        }
    }

    const handleError = (response: api.Response) => {
        if (response.argument === "name") {
            setGlobalErrorMessageField({
                errorMessage: [],
                hint: [],
            })
            setNameField({
                errorMessage: response.getErrorMessage(),
                hint: response.getHint(),
                value: nameField.value,
            })
            return
        }
        if (response.argument === "parent_id") {
            setGlobalErrorMessageField({
                errorMessage: [],
                hint: [],
            })
            setNameField({
                errorMessage: [],
                hint: [],
                value: nameField.value,
            })
            return
        }

        // その他のエラーは入力内容と無関係
        setNameField({
            errorMessage: [],
            hint: [],
            value: nameField.value,
        })
        setGlobalErrorMessageField({
            errorMessage: response.getErrorMessage(),
            hint: response.getHint(),
        })
    }

    return {
        nameField,
        globalErrorMessageField,
        handleUpdateNameValue,
        handleSubmit,
    }
}

const context = {
    nameField: {
        errorMessage: [],
        hint: [],
        value: "",
    },
    globalErrorMessageField: {
        errorMessage: [],
        hint: [],
    },
    handleUpdateNameValue: null,
}

export const CreateChannelGroupFormContext = createContext(context)
