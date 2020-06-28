import { useState, useCallback, createContext } from "react"
import * as WebAPI from "../api"
import {
    WebAPINotAvailableResponse,
    UnexpectedResponseError,
} from "../api/classes"

export const useSignupFormState = () => {
    const initialState = {
        errorMessage: [],
        hint: [],
        value: "",
    }
    const [nameField, setNameField] = useState(initialState)
    const [passwordField, setPasswordField] = useState(initialState)
    const [confirmedPasswordField, setConfirmedPasswordField] = useState(
        initialState
    )
    const [globalErrorMessageField, setGlobalErrorMessageField] = useState({
        errorMessage: [],
        hint: [],
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

    const handleUpdatePasswordValue = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setPasswordField({
                errorMessage: passwordField.errorMessage,
                hint: passwordField.hint,
                value: event.target.value,
            })
        },
        [passwordField]
    )

    const handleUpdateConfirmedPasswordValue = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setConfirmedPasswordField({
                errorMessage: confirmedPasswordField.errorMessage,
                hint: confirmedPasswordField.hint,
                value: event.target.value,
            })
        },
        [confirmedPasswordField]
    )

    const signup = async () => {
        try {
            return await WebAPI.account.signup({
                name: nameField.value,
                password: passwordField.value,
                confirmed_password: confirmedPasswordField.value,
            })
        } catch (error) {
            if (error instanceof UnexpectedResponseError) {
                throw error
            }
            handleError(new WebAPI.Response(WebAPINotAvailableResponse))
        }
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const response = await signup()
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
            setConfirmedPasswordField({
                errorMessage: [],
                hint: [],
                value: confirmedPasswordField.value,
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
            setPasswordField({
                errorMessage: [],
                hint: [],
                value: passwordField.value,
            })
            setConfirmedPasswordField({
                errorMessage: [],
                hint: [],
                value: confirmedPasswordField.value,
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
            setConfirmedPasswordField({
                errorMessage: [],
                hint: [],
                value: confirmedPasswordField.value,
            })
            setPasswordField({
                errorMessage: response.getErrorMessage(),
                hint: response.getHint(),
                value: passwordField.value,
            })
            return
        }
        if (response.argument === "confirmed_password") {
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
            setConfirmedPasswordField({
                errorMessage: response.getErrorMessage(),
                hint: response.getHint(),
                value: confirmedPasswordField.value,
            })
            return
        }
        if (response.getErrorCode() === "name_taken") {
            setGlobalErrorMessageField({
                errorMessage: [],
                hint: [],
            })
            setPasswordField({
                errorMessage: [],
                hint: [],
                value: passwordField.value,
            })
            setConfirmedPasswordField({
                errorMessage: [],
                hint: [],
                value: confirmedPasswordField.value,
            })
            setNameField({
                errorMessage: response.getErrorMessage(),
                hint: response.getHint(),
                value: nameField.value,
            })
            return
        }

        // その他のエラーは入力内容と無関係
        setPasswordField({
            errorMessage: [],
            hint: [],
            value: passwordField.value,
        })
        setConfirmedPasswordField({
            errorMessage: [],
            hint: [],
            value: confirmedPasswordField.value,
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
        confirmedPasswordField,
        globalErrorMessageField,
        handleUpdateNameValue,
        handleUpdatePasswordValue,
        handleUpdateConfirmedPasswordValue,
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
    confirmedPasswordField: {
        errorMessage: [],
        hint: [],
        value: "",
    },
    globalErrorMessageField: {
        errorMessage: [],
        hint: [],
        value: "",
    },
    handleUpdateNameValue: null,
    handleUpdatePasswordValue: null,
    handleUpdateConfirmedPasswordValue: null,
}

export const SignupFormContext = createContext(context)
