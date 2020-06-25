import React, { useState, createContext, useContext, useCallback } from "react"
import classnames from "classnames"
import * as api from "../api"

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
const SignupFormContext = createContext(context)

type InputComponentAttributes = {
    name: string
    type: string
    value: string
    onChange: any
    label: string
    errorMessage: string[]
    hint: string[]
}

const InputComponent = ({
    name,
    type,
    value,
    onChange,
    label,
    errorMessage,
    hint,
}: InputComponentAttributes) => {
    return (
        <div
            className={classnames("input-component", {
                error: errorMessage.length > 0,
                hint: hint.length > 0,
            })}
        >
            <label className="label">{label}</label>
            <input name={name} value={value} type={type} onChange={onChange} />
            {errorMessage.map((line, index) => {
                return (
                    <p key={index} className="error-message">
                        {line}
                    </p>
                )
            })}
            {hint.map((line, index) => {
                return (
                    <p key={index} className="hint">
                        {line}
                    </p>
                )
            })}
            <style jsx>{`
                .input-component {
                }
                .label {
                    display: block;
                }
                .error-message {
                    display: none;
                    color: red;
                }
                .input-component.error .error-message {
                    display: block;
                }
            `}</style>
        </div>
    )
}

const TextInputName = () => {
    const { nameField, handleUpdateNameValue } = useContext(SignupFormContext)
    return (
        <InputComponent
            label="ユーザー名"
            type="text"
            name="name"
            value={nameField.value}
            errorMessage={nameField.errorMessage}
            hint={nameField.hint}
            onChange={handleUpdateNameValue}
        />
    )
}
const TextInputPassword = () => {
    const { passwordField, handleUpdatePasswordValue } = useContext(
        SignupFormContext
    )
    return (
        <InputComponent
            label="パスワード"
            type="password"
            name="password"
            value={passwordField.value}
            errorMessage={passwordField.errorMessage}
            hint={passwordField.hint}
            onChange={handleUpdatePasswordValue}
        />
    )
}
const TextInputConfirmedPassword = () => {
    const {
        confirmedPasswordField,
        handleUpdateConfirmedPasswordValue,
    } = useContext(SignupFormContext)
    return (
        <InputComponent
            label="パスワードの確認"
            type="password"
            name="confirmed_password"
            value={confirmedPasswordField.value}
            errorMessage={confirmedPasswordField.errorMessage}
            hint={confirmedPasswordField.hint}
            onChange={handleUpdateConfirmedPasswordValue}
        />
    )
}

export const SignupFormComponent = () => {
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
        (event) => {
            setNameField({
                errorMessage: nameField.errorMessage,
                hint: nameField.hint,
                value: event.target.value,
            })
        },
        [nameField]
    )
    const handleUpdatePasswordValue = useCallback(
        (event) => {
            setPasswordField({
                errorMessage: passwordField.errorMessage,
                hint: passwordField.hint,
                value: event.target.value,
            })
        },
        [passwordField]
    )
    const handleUpdateConfirmedPasswordValue = useCallback(
        (event) => {
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
        try {
            const response = await api.post("account/signup", {
                name: nameField.value,
                password: passwordField.value,
                confirmed_password: confirmedPasswordField.value,
            })
            handleError(response)
        } catch (error) {
            console.log(error)
        }
    }
    const handleError = (response: api.Response) => {
        console.log(response)
        if (response.argument === "name") {
            return setNameField({
                errorMessage: response.getErrorMessage(),
                hint: response.getHint(),
                value: nameField.value,
            })
        }
        if (response.argument === "password") {
            return setPasswordField({
                errorMessage: response.getErrorMessage(),
                hint: response.getHint(),
                value: passwordField.value,
            })
        }
        if (response.argument === "confirmed_password") {
            return setConfirmedPasswordField({
                errorMessage: response.getErrorMessage(),
                hint: response.getHint(),
                value: confirmedPasswordField.value,
            })
        }
        if (response.getErrorCode() === "name_taken") {
            return setNameField({
                errorMessage: response.getErrorMessage(),
                hint: response.getHint(),
                value: nameField.value,
            })
        }
    }

    return (
        <SignupFormContext.Provider
            value={{
                nameField,
                passwordField,
                confirmedPasswordField,
                handleUpdateNameValue,
                handleUpdatePasswordValue,
                handleUpdateConfirmedPasswordValue,
            }}
        >
            <form method="POST" action="/signup" onSubmit={handleSubmit}>
                <TextInputName />
                <TextInputPassword />
                <TextInputConfirmedPassword />
                <button type="submit">登録する</button>
            </form>
        </SignupFormContext.Provider>
    )
}
