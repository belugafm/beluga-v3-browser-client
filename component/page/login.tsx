import React, { useContext } from "react"
import { SigninFormContext, useSigninFormState } from "../../state/account/signin"

import { InputComponent } from "../form/input"
import { swrGetLoggedInUser } from "../../swr/session"

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
                    color: red;
                }
            `}</style>
        </div>
    )
}

const AlreadyLoggedInMessageComponent = () => {
    const { loggedInUser } = swrGetLoggedInUser()
    if (loggedInUser) {
        return <div>{`${loggedInUser.name}としてログイン中です`}</div>
    } else {
        return null
    }
}

export const SigninFormComponent = ({ userNamePlaceholder }) => {
    const {
        nameField,
        passwordField,
        globalErrorMessageField,
        handleUpdateNameValue,
        handleUpdatePasswordValue,
        handleSubmit,
    } = useSigninFormState(userNamePlaceholder)

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
                <AlreadyLoggedInMessageComponent />
                <GlobalErrorMessageComponent />
                <NameInputForm />
                <PasswordInputForm />
                <div className="button-container">
                    <button type="submit">ログイン</button>
                </div>
                <style jsx>{`
                    .button-container {
                        text-align: right;
                        margin-top: 20px;
                    }
                    button {
                        font-family: "M PLUS 1", sans-serif;
                        font-weight: 700;
                        width: 140px;
                        font-size: 16px;
                        flex: 0 0 auto;
                        box-sizing: border-box;
                        margin: 10px;
                        margin-right: 0;
                        padding: 0 16px;
                        cursor: pointer;
                        border-radius: 50px;
                        height: 48px;
                        background-color: #2a85ff;
                        color: white;
                        transition: 0.3s;
                        border: none;
                    }
                    button:hover {
                        transform: translateY(-3px);
                        background-color: #0069f6;
                    }
                    button:active {
                        background-color: rgb(90, 90, 90);
                    }
                `}</style>
            </form>
        </SigninFormContext.Provider>
    )
}
