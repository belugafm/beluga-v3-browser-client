import { useState, useCallback, createContext } from "react"
import * as WebAPI from "../api"

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

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        try {
            const response = await WebAPI.account.signup({
                name: nameField.value,
                password: passwordField.value,
                confirmed_password: confirmedPasswordField.value,
            })
            if (response.ok) {
            } else {
                handleError(response)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleError = (response: WebAPI.Response) => {
        if (response.argument === "name") {
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
            return setNameField({
                errorMessage: response.getErrorMessage(),
                hint: response.getHint(),
                value: nameField.value,
            })
        }
        if (response.argument === "password") {
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
            return setPasswordField({
                errorMessage: response.getErrorMessage(),
                hint: response.getHint(),
                value: passwordField.value,
            })
        }
        if (response.argument === "confirmed_password") {
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
            return setConfirmedPasswordField({
                errorMessage: response.getErrorMessage(),
                hint: response.getHint(),
                value: confirmedPasswordField.value,
            })
        }
        if (response.getErrorCode() === "name_taken") {
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
            return setNameField({
                errorMessage: response.getErrorMessage(),
                hint: response.getHint(),
                value: nameField.value,
            })
        }
    }

    return {
        nameField,
        passwordField,
        confirmedPasswordField,
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
    handleUpdateNameValue: null,
    handleUpdatePasswordValue: null,
    handleUpdateConfirmedPasswordValue: null,
}
export const SignupFormContext = createContext(context)
