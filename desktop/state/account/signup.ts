import * as WebAPI from "../../api"

import { UnexpectedResponseError, WebAPIUnavailableResponse } from "../../api/classes"
import { createContext, useState } from "react"

export const useSignupFormState = () => {
    const initialState = {
        errorMessage: [],
        hint: [],
        value: "",
    }
    const [nameField, setNameField] = useState(initialState)
    const [passwordField, setPasswordField] = useState(initialState)
    const [confirmationPasswordField, setConfirmationPasswordField] = useState(initialState)
    const [globalErrorMessageField, setGlobalErrorMessageField] = useState({
        errorMessage: [],
        hint: [],
    })
    const [termsOfServiceAgreementField, setTermsOfServiceAgreementField] = useState({
        errorMessage: [],
        hint: [],
        checked: false,
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

    const handleUpdateConfirmationPasswordValue = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmationPasswordField({
            errorMessage: confirmationPasswordField.errorMessage,
            hint: confirmationPasswordField.hint,
            value: event.target.value,
        })
    }

    const handleTermsOfServiceAgreementChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTermsOfServiceAgreementField({
            errorMessage: termsOfServiceAgreementField.errorMessage,
            hint: termsOfServiceAgreementField.hint,
            checked: event.target.checked,
        })
    }

    const signup = async () => {
        if (termsOfServiceAgreementField.checked !== true) {
            return new WebAPI.Response({
                ok: false,
                error_code: "you_must_agree_to_terms_of_service",
                description: ["利用規約をお読みください"],
                hint: ["同意する場合はチェックボックスにチェックを入れてください"],
            })
        }
        try {
            return await WebAPI.account.signup({
                name: nameField.value,
                password: passwordField.value,
                confirmationPassword: confirmationPasswordField.value,
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
            setConfirmationPasswordField({
                errorMessage: [],
                hint: [],
                value: confirmationPasswordField.value,
            })
            setTermsOfServiceAgreementField({
                errorMessage: [],
                hint: [],
                checked: true,
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
            setConfirmationPasswordField({
                errorMessage: [],
                hint: [],
                value: confirmationPasswordField.value,
            })
            setNameField({
                errorMessage: response.getErrorMessage(),
                hint: response.getHint(),
                value: nameField.value,
            })
            setTermsOfServiceAgreementField({
                errorMessage: [],
                hint: [],
                checked: termsOfServiceAgreementField.checked,
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
            setConfirmationPasswordField({
                errorMessage: [],
                hint: [],
                value: confirmationPasswordField.value,
            })
            setPasswordField({
                errorMessage: response.getErrorMessage(),
                hint: response.getHint(),
                value: passwordField.value,
            })
            setTermsOfServiceAgreementField({
                errorMessage: [],
                hint: [],
                checked: termsOfServiceAgreementField.checked,
            })
            return
        }
        if (response.argument === "confirmation_password") {
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
            setConfirmationPasswordField({
                errorMessage: response.getErrorMessage(),
                hint: response.getHint(),
                value: confirmationPasswordField.value,
            })
            setTermsOfServiceAgreementField({
                errorMessage: [],
                hint: [],
                checked: termsOfServiceAgreementField.checked,
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
            setConfirmationPasswordField({
                errorMessage: [],
                hint: [],
                value: confirmationPasswordField.value,
            })
            setNameField({
                errorMessage: response.getErrorMessage(),
                hint: response.getHint(),
                value: nameField.value,
            })
            setTermsOfServiceAgreementField({
                errorMessage: [],
                hint: [],
                checked: termsOfServiceAgreementField.checked,
            })
            return
        }
        if (response.getErrorCode() === "you_must_agree_to_terms_of_service") {
            setGlobalErrorMessageField({
                errorMessage: [],
                hint: [],
            })
            setPasswordField({
                errorMessage: [],
                hint: [],
                value: passwordField.value,
            })
            setConfirmationPasswordField({
                errorMessage: [],
                hint: [],
                value: confirmationPasswordField.value,
            })
            setNameField({
                errorMessage: [],
                hint: [],
                value: nameField.value,
            })
            setTermsOfServiceAgreementField({
                errorMessage: response.getErrorMessage(),
                hint: response.getHint(),
                checked: false,
            })
            return
        }

        // その他のエラーは入力内容と無関係
        setPasswordField({
            errorMessage: [],
            hint: [],
            value: passwordField.value,
        })
        setConfirmationPasswordField({
            errorMessage: [],
            hint: [],
            value: confirmationPasswordField.value,
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
        setTermsOfServiceAgreementField({
            errorMessage: [],
            hint: [],
            checked: termsOfServiceAgreementField.checked,
        })
    }

    return {
        nameField,
        passwordField,
        confirmedPasswordField: confirmationPasswordField,
        globalErrorMessageField,
        termsOfServiceAgreementField,
        handleUpdateNameValue,
        handleUpdatePasswordValue,
        handleUpdateConfirmationPasswordValue,
        handleTermsOfServiceAgreementChecked,
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
    termsOfServiceAgreementField: {
        errorMessage: [],
        hint: [],
        checked: false,
    },
    handleUpdateNameValue: null,
    handleUpdatePasswordValue: null,
    handleUpdateConfirmationPasswordValue: null,
    handleTermsOfServiceAgreementChecked: null,
}

export const SignupFormContext = createContext(context)
