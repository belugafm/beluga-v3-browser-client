import React, { useContext } from "react"
import { SignupFormContext, useSignupFormState } from "../../../state/account/signup"

import { LoginWithTwitterButton } from "../../buttons/login_with_twitter"
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
    const [theme] = useTheme()
    const { termsOfServiceAgreementField, handleTermsOfServiceAgreementChecked } =
        useContext(SignupFormContext)
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
                onChange={handleTermsOfServiceAgreementChecked}
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
        return (
            <div>
                <p>{`${loggedInUser.name}としてログイン中です`}</p>
            </div>
        )
    } else {
        return null
    }
}

const TrollsComponent = () => {
    return (
        <div>
            <p>
                荒らし対策のため「Twitterでログイン」機能を使わずに登録したユーザーの機能を制限しています
            </p>
            <p>
                詳細は<a href="/arashi_taisaku">荒らし対策について</a>をお読みください
            </p>
            <p>
                <LoginWithTwitterButton />
            </p>
        </div>
    )
}

const InviteLinkComponent = () => {
    return (
        <div>
            <p>招待リンクについて書く</p>
        </div>
    )
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
                <TrollsComponent />
                <InviteLinkComponent />
                <AlreadyLoggedInMessageComponent />
                <GlobalErrorMessageComponent />
                <PasswordInputForm />
                <ConfirmedPasswordInputForm />
                <TermsOfServiceCheckbox />
                <button type="submit">登録する</button>
            </form>
        </SignupFormContext.Provider>
    )
}
