import * as WebAPI from "../../api"

import { UnexpectedResponseError, WebAPIUnavailableResponse } from "../../api/fetch"
import { createContext, useState } from "react"

export const useSigninFormState = (userNamePlaceholder: string) => {
    const initialState = {
        errorMessage: [],
        hint: [],
        value: "",
    }

    const [nameField, setNameField] = useState({
        errorMessage: [],
        hint: [],
        value: userNamePlaceholder,
    })
    const [passwordField, setPasswordField] = useState(initialState)
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

    const handleUpdatePasswordValue = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordField({
            errorMessage: passwordField.errorMessage,
            hint: passwordField.hint,
            value: event.target.value,
        })
    }

    const signin = async () => {
        try {
            return await WebAPI.account.signin({
                name: nameField.value,
                password: passwordField.value,
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
        const response = await signin()
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
            setPasswordField({
                errorMessage: [],
                hint: [],
                value: passwordField.value,
            })
            location.href = "/welcome"
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
            setPasswordField({
                errorMessage: [],
                hint: [],
                value: passwordField.value,
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
            setPasswordField({
                errorMessage: response.getErrorMessage(),
                hint: response.getHint(),
                value: passwordField.value,
            })
            return
        }

        // その他のエラーは入力内容と無関係
        setPasswordField({
            errorMessage: [],
            hint: [],
            value: passwordField.value,
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
        passwordField,
        globalErrorMessageField,
        handleUpdateNameValue,
        handleUpdatePasswordValue,
        handleSubmit,
    }
}

const context = {
    nameField: {
        errorMessage: [],
        hint: [],
        value: "",
    },
    passwordField: {
        errorMessage: [],
        hint: [],
        value: "",
    },
    globalErrorMessageField: {
        errorMessage: [],
        hint: [],
    },
    handleUpdateNameValue: null,
    handleUpdatePasswordValue: null,
}

export const SigninFormContext = createContext(context)
