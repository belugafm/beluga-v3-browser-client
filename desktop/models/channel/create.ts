import { useState, useCallback, createContext } from "react"
import * as WebAPI from "../../api"
import {
    WebAPIUnavailableResponse,
    UnexpectedResponseError,
} from "../../api/classes"

export const useChannelCreateFormState = () => {
    const initialState = {
        errorMessage: [],
        hint: [],
        value: "",
    }
    const [nameField, setNameField] = useState(initialState)
    const [descriptionField, setDescriptionField] = useState(initialState)
    const [globalErrorMessageField, setGlobalErrorMessageField] = useState({
        errorMessage: [],
        hint: [],
    })
    const [isPublicField, setIsPublicField] = useState({
        errorMessage: [],
        hint: [],
        checked: true,
    })

    const handleUpdateNameValue = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setNameField({
                errorMessage: nameField.errorMessage,
                hint: nameField.hint,
                value: event.target.value,
            })
        },
        [nameField]
    )

    const handleUpdateDescriptionValue = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setDescriptionField({
                errorMessage: descriptionField.errorMessage,
                hint: descriptionField.hint,
                value: event.target.value,
            })
        },
        [descriptionField]
    )

    const handleUpdateIsPublicChecked = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setIsPublicField({
                errorMessage: isPublicField.errorMessage,
                hint: isPublicField.hint,
                checked: event.target.checked,
            })
        },
        [isPublicField]
    )

    const create = async () => {
        try {
            return await WebAPI.channels.create({
                name: nameField.value,
                description: descriptionField.value,
                is_public: isPublicField.checked,
            })
        } catch (error) {
            if (error instanceof UnexpectedResponseError) {
                throw error
            }
            return new WebAPI.Response(WebAPIUnavailableResponse)
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
            setDescriptionField({
                errorMessage: [],
                hint: [],
                value: descriptionField.value,
            })
        } else {
            handleError(response)
        }
    }

    const handleError = (response: WebAPI.Response) => {
        if (response.argument === "name") {
            setGlobalErrorMessageField({
                errorMessage: [],
                hint: [],
            })
            setDescriptionField({
                errorMessage: [],
                hint: [],
                value: descriptionField.value,
            })
            setNameField({
                errorMessage: response.getErrorMessage(),
                hint: response.getHint(),
                value: nameField.value,
            })
            return
        }
        if (response.argument === "password") {
            setGlobalErrorMessageField({
                errorMessage: [],
                hint: [],
            })
            setNameField({
                errorMessage: [],
                hint: [],
                value: nameField.value,
            })
            setDescriptionField({
                errorMessage: response.getErrorMessage(),
                hint: response.getHint(),
                value: descriptionField.value,
            })
            return
        }

        // その他のエラーは入力内容と無関係
        setDescriptionField({
            errorMessage: [],
            hint: [],
            value: descriptionField.value,
        })
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
        descriptionField,
        globalErrorMessageField,
        isPublicField,
        handleUpdateNameValue,
        handleUpdateDescriptionValue,
        handleUpdateIsPublicChecked,
        handleSubmit,
    }
}

const context = {
    nameField: {
        errorMessage: [],
        hint: [],
        value: "",
    },
    descriptionField: {
        errorMessage: [],
        hint: [],
        value: "",
    },
    isPublicField: {
        errorMessage: [],
        hint: [],
        checked: true,
    },
    globalErrorMessageField: {
        errorMessage: [],
        hint: [],
    },
    handleUpdateNameValue: null,
    handleUpdateDescriptionValue: null,
    handleUpdateIsPublicChecked: null,
}

export const CreateChannelFormContext = createContext(context)
