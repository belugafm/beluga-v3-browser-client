import React, { useContext } from "react"
import classnames from "classnames"
import { useTheme } from "../../theme"
import {
    useSignupFormState,
    SignupFormContext,
} from "../../../models/account/signup"
import { useLoggedInUser } from "../../../models/session"

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

const FormInputName = () => {
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
const FormInputPassword = () => {
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
const FormInputConfirmedPassword = () => {
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

const TermsOfServiceCheckbox = () => {
    const [theme] = useTheme()
    const {
        termsOfServiceAgreementField,
        handleTermsOfServiceAgreementChange,
    } = useContext(SignupFormContext)
    return (
        <div>
            <a
                href="https://github.com/belugafm/beluga-v2-api-server/blob/master/terms_of_service.md"
                target="_blank">
                利用規約
            </a>
            および
            <a
                href="https://github.com/belugafm/beluga-v2-api-server/blob/master/privacy.md"
                target="_blank">
                プライバシーポリシー
            </a>
            を読み、同意します
            <input
                type="checkbox"
                checked={termsOfServiceAgreementField.checked}
                onChange={handleTermsOfServiceAgreementChange}
            />
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
                    color: ${theme.global.current.errorMessageFontColor};
                }
            `}</style>
        </div>
    )
}

const GlobalErrorMessageComponent = () => {
    const [theme] = useTheme()
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
                    color: ${theme.global.current.errorMessageFontColor};
                }
            `}</style>
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

export const SignupFormComponent = () => {
    const {
        nameField,
        passwordField,
        confirmedPasswordField,
        globalErrorMessageField,
        termsOfServiceAgreementField,
        handleUpdateNameValue,
        handleUpdatePasswordValue,
        handleUpdateConfirmedPasswordValue,
        handleTermsOfServiceAgreementChange,
        handleSubmit,
    } = useSignupFormState()

    return (
        <SignupFormContext.Provider
            value={{
                nameField,
                passwordField,
                confirmedPasswordField,
                globalErrorMessageField,
                termsOfServiceAgreementField,
                handleUpdateNameValue,
                handleUpdatePasswordValue,
                handleUpdateConfirmedPasswordValue,
                handleTermsOfServiceAgreementChange,
            }}>
            <form method="POST" action="" onSubmit={handleSubmit}>
                <AlreadyLoggedInMessageComponent />
                <GlobalErrorMessageComponent />
                <FormInputName />
                <FormInputPassword />
                <FormInputConfirmedPassword />
                <TermsOfServiceCheckbox />
                <button type="submit">登録する</button>
            </form>
        </SignupFormContext.Provider>
    )
}
