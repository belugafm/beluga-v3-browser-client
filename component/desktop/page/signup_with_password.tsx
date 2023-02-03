import React, { useContext } from "react"
import { SignupFormContext, useSignupFormState } from "../../../state/account/signup"

import { InputComponent } from "../form/input"
import { swrGetLoggedInUser } from "../../../swr/session"
import { useTheme } from "../theme"

const PasswordInputForm = () => {
    const { passwordField, handleUpdatePasswordValue } = useContext(SignupFormContext)
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
const ConfirmedPasswordInputForm = () => {
    const { confirmedPasswordField, handleUpdateConfirmationPasswordValue } =
        useContext(SignupFormContext)
    return (
        <InputComponent
            label="パスワードの確認"
            type="password"
            name="confirmation_password"
            value={confirmedPasswordField.value}
            errorMessage={confirmedPasswordField.errorMessage}
            hint={confirmedPasswordField.hint}
            onChange={handleUpdateConfirmationPasswordValue}
        />
    )
}

const TermsOfServiceCheckbox = () => {
    const { termsOfServiceAgreementField, handleTermsOfServiceAgreementChecked } =
        useContext(SignupFormContext)
    return (
        <div>
            <input
                type="checkbox"
                checked={termsOfServiceAgreementField.checked}
                onChange={handleTermsOfServiceAgreementChecked}
            />
            <a
                href="https://raw.githubusercontent.com/belugafm/beluga-v2-core/master/terms_of_service.md"
                target="_blank">
                利用規約
            </a>
            および
            <a
                href="https://raw.githubusercontent.com/belugafm/beluga-v2-core/master/privacy.md"
                target="_blank">
                プライバシーポリシー
            </a>
            を読み、同意します
            {termsOfServiceAgreementField.errorMessage.map((line, index) => {
                return (
                    <p key={index} className="error-message">
                        {line}
                    </p>
                )
            })}
            {termsOfServiceAgreementField.hint.map((line, index) => {
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

const GlobalErrorMessageComponent = () => {
    const { globalErrorMessageField } = useContext(SignupFormContext)
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
        return (
            <div>
                <p>{`${loggedInUser.name}としてログイン中です`}</p>
            </div>
        )
    } else {
        return null
    }
}

export const SignupFormComponent = () => {
    const {
        passwordField,
        confirmedPasswordField,
        globalErrorMessageField,
        termsOfServiceAgreementField,
        handleUpdatePasswordValue,
        handleUpdateConfirmationPasswordValue,
        handleTermsOfServiceAgreementChecked,
        handleSubmit,
    } = useSignupFormState()
    return (
        <SignupFormContext.Provider
            value={{
                passwordField,
                confirmedPasswordField,
                globalErrorMessageField,
                termsOfServiceAgreementField,
                handleUpdatePasswordValue,
                handleUpdateConfirmationPasswordValue,
                handleTermsOfServiceAgreementChecked,
            }}>
            <form method="POST" action="" onSubmit={handleSubmit}>
                <GlobalErrorMessageComponent />
                <PasswordInputForm />
                <ConfirmedPasswordInputForm />
                <TermsOfServiceCheckbox />
                <div className="button-container">
                    <button type="submit">登録する</button>
                </div>
                <style jsx>{`
                    .button-container {
                        text-align: right;
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
        </SignupFormContext.Provider>
    )
}
