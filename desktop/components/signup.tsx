import React, { useState, createContext, useContext, useCallback } from "react"
import classnames from "classnames"
import * as api from "../api"

const context = {
    name_field: {
        error_message: [],
        hint: [],
        value: "",
    },
    password_field: {
        error_message: [],
        hint: [],
        value: "",
    },
    confirmed_password_field: {
        error_message: [],
        hint: [],
        value: "",
    },
    handleUpdateNameValue: null,
    handleUpdatePasswordValue: null,
    handleUpdateConfirmedPasswordValue: null,
}
const SignupFormContext = createContext(context)

type InputComponentInput = {
    name: string
    type: string
    value: string
    onChange: any
    label: string
    error_message: string[]
    hint: string[]
}

const InputComponent = ({
    name,
    type,
    value,
    onChange,
    label,
    error_message,
    hint,
}: InputComponentInput) => {
    return (
        <div
            className={classnames("input-component", {
                error: error_message.length > 0,
                hint: hint.length > 0,
            })}
        >
            <label className="label">{label}</label>
            <input name={name} value={value} type={type} onChange={onChange} />
            {error_message.map((line, index) => {
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
    const { name_field, handleUpdateNameValue } = useContext(SignupFormContext)
    return (
        <InputComponent
            label="ユーザー名"
            type="text"
            name="name"
            value={name_field.value}
            error_message={name_field.error_message}
            hint={name_field.hint}
            onChange={handleUpdateNameValue}
        />
    )
}
const TextInputPassword = () => {
    const { password_field, handleUpdatePasswordValue } = useContext(
        SignupFormContext
    )
    return (
        <InputComponent
            label="パスワード"
            type="password"
            name="password"
            value={password_field.value}
            error_message={password_field.error_message}
            hint={password_field.hint}
            onChange={handleUpdatePasswordValue}
        />
    )
}
const TextInputConfirmedPassword = () => {
    const {
        confirmed_password_field,
        handleUpdateConfirmedPasswordValue,
    } = useContext(SignupFormContext)
    return (
        <InputComponent
            label="パスワードの確認"
            type="password"
            name="confirmed_password"
            value={confirmed_password_field.value}
            error_message={confirmed_password_field.error_message}
            hint={confirmed_password_field.hint}
            onChange={handleUpdateConfirmedPasswordValue}
        />
    )
}

export const SignupFormComponent = () => {
    const initial_state = {
        error_message: [],
        hint: [],
        value: "",
    }
    const [name_field, setName] = useState(initial_state)
    const [password_field, setPassword] = useState(initial_state)
    const [confirmed_password_field, setConfirmedPassword] = useState(
        initial_state
    )
    const handleUpdateNameValue = useCallback(
        (event) => {
            setName({
                error_message: name_field.error_message,
                hint: name_field.hint,
                value: event.target.value,
            })
        },
        [name_field]
    )
    const handleUpdatePasswordValue = useCallback(
        (event) => {
            setPassword({
                error_message: password_field.error_message,
                hint: password_field.hint,
                value: event.target.value,
            })
        },
        [password_field]
    )
    const handleUpdateConfirmedPasswordValue = useCallback(
        (event) => {
            setConfirmedPassword({
                error_message: confirmed_password_field.error_message,
                hint: confirmed_password_field.hint,
                value: event.target.value,
            })
        },
        [confirmed_password_field]
    )
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setName({
            error_message: [],
            hint: [],
            value: name_field.value,
        })
        setPassword({
            error_message: [],
            hint: [],
            value: password_field.value,
        })
        setConfirmedPassword({
            error_message: [],
            hint: [],
            value: confirmed_password_field.value,
        })
        try {
            const response = await api.post("account/signup", {
                name: name_field.value,
                password: password_field.value,
                confirmed_password: confirmed_password_field.value,
            })
            handleError(response)
        } catch (error) {
            console.log(error)
        }
    }
    const handleError = (response: api.Response) => {
        console.log(response)
        if (response.argument === "name") {
            return setName({
                error_message: response.getErrorMessage(),
                hint: response.getHint(),
                value: name_field.value,
            })
        }
        if (response.argument === "password") {
            return setPassword({
                error_message: response.getErrorMessage(),
                hint: response.getHint(),
                value: password_field.value,
            })
        }
        if (response.argument === "confirmed_password") {
            return setConfirmedPassword({
                error_message: response.getErrorMessage(),
                hint: response.getHint(),
                value: confirmed_password_field.value,
            })
        }
        if (response.getErrorCode() === "name_taken") {
            return setName({
                error_message: response.getErrorMessage(),
                hint: response.getHint(),
                value: name_field.value,
            })
        }
    }

    return (
        <SignupFormContext.Provider
            value={{
                name_field,
                password_field,
                confirmed_password_field,
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
