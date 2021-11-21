import React, { useContext } from "react"
import { SigninFormContext, useSigninFormState } from "../../../state/account/signin"

import classnames from "classnames"
import { useLoggedInUser } from "../../../state/session"
import { useTheme } from "../../theme"

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
    const [theme] = useTheme()
    return (
        <div
            className={classnames("input-component", {
                error: errorMessage.length > 0,
                hint: hint.length > 0,
            })}>
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
                    margin: auto;
                }
                .label {
                    display: block;
                }
                .error-message {
                    display: none;
                }
                .input-component.error .error-message {
                    display: block;
                }
            `}</style>
            <style jsx>{`
                .error-message {
                    color: ${theme.global.current.errorMessageFontColor};
                }
            `}</style>
        </div>
    )
}

const NameInputForm = () => {
    const { nameField, handleUpdateNameValue } = useContext(SigninFormContext)
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
const PasswordInputForm = () => {
    const { passwordField, handleUpdatePasswordValue } = useContext(SigninFormContext)
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

const GlobalErrorMessageComponent = () => {
    const [theme] = useTheme()
    const { globalErrorMessageField } = useContext(SigninFormContext)
    return (
        <div className="global-error">
            {globalErrorMessageField.errorMessage.map((line, index) => {
                return (
                    <p key={index} className="error-message">
                        {line}
                    </p>
                )
            })}
            {globalErrorMessageField.hint.map((line, index) => {
                return (
                    <p key={index} className="hint">
                        {line}
                    </p>
                )
            })}
            <style jsx>{`
                .error-message {
                    color: ${theme.global.current.errorMessageFontColor};
                }
            `}</style>
        </div>
    )
}

const LoginWithTwitterComponent = () => {
    return (
        <div>
            <p>
                <a href="/login_with_twitter">Twitterでログインする</a>
            </p>
        </div>
    )
}

const AlreadyLoggedInMessageComponent = () => {
    const { loggedInUser } = useLoggedInUser()
    if (loggedInUser) {
        return <div>{`${loggedInUser.name}としてログイン中です`}</div>
    } else {
        return null
    }
}

export const SigninFormComponent = () => {
    const {
        nameField,
        passwordField,
        globalErrorMessageField,
        handleUpdateNameValue,
        handleUpdatePasswordValue,
        handleSubmit,
    } = useSigninFormState()

    return (
        <SigninFormContext.Provider
            value={{
                nameField,
                passwordField,
                globalErrorMessageField,
                handleUpdateNameValue,
                handleUpdatePasswordValue,
            }}>
            <form method="POST" action="" onSubmit={handleSubmit}>
                <LoginWithTwitterComponent />
                <AlreadyLoggedInMessageComponent />
                <GlobalErrorMessageComponent />
                <NameInputForm />
                <PasswordInputForm />
                <button type="submit">ログイン</button>
            </form>
        </SigninFormContext.Provider>
    )
}
