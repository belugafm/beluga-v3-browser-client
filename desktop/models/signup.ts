import { useState, useCallback, createContext } from "react"
import * as WebAPI from "../api"
import {
    WebAPIUnavailableResponse,
    UnexpectedResponseError,
} from "../api/classes"
import fp from "fingerprintjs2"
import crypto from "crypto"

const getBrowserFingerprint = (): Promise<string> => {
    return new Promise((resolve, reject) => {
        // @ts-ignore
        if (window.requestIdleCallback) {
            // @ts-ignore
            requestIdleCallback(() => {
                fp.get((components) => {
                    const values = components.map((component) => {
                        return component.value
                    })
                    resolve(
                        crypto
                            .createHash("sha256")
                            .update(values.join(""))
                            .digest("hex")
                    )
                })
            })
        } else {
            setTimeout(() => {
                fp.get((components) => {
                    const values = components.map((component) => {
                        return component.value
                    })
                    resolve(
                        crypto
                            .createHash("sha256")
                            .update(values.join(""))
                            .digest("hex")
                    )
                })
            }, 500)
        }
    })
}

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
        const fingerprint = await getBrowserFingerprint()
        try {
            return await WebAPI.account.signup({
                name: nameField.value,
                password: passwordField.value,
                confirmed_password: confirmedPasswordField.value,
                fingerprint: fingerprint,
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
    },
    handleUpdateNameValue: null,
    handleUpdatePasswordValue: null,
    handleUpdateConfirmedPasswordValue: null,
}

export const SignupFormContext = createContext(context)
