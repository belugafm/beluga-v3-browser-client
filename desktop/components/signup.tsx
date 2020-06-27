import React, { useState, createContext, useContext, useCallback } from "react"
import classnames from "classnames"
import * as WebAPI from "../api"
import { useTheme } from "./theme"
import { useSignupFormState, SignupFormContext } from "../models/signup"

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
                    color: red;
                }
                .input-component.error .error-message {
                    display: block;
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

export const SignupFormComponent = () => {
    const {
        nameField,
        passwordField,
        confirmedPasswordField,
        handleUpdateNameValue,
        handleUpdatePasswordValue,
        handleUpdateConfirmedPasswordValue,
        handleSubmit,
    } = useSignupFormState()

    return (
        <SignupFormContext.Provider
            value={{
                nameField,
                passwordField,
                confirmedPasswordField,
                handleUpdateNameValue,
                handleUpdatePasswordValue,
                handleUpdateConfirmedPasswordValue,
            }}>
            <form method="POST" action="/signup" onSubmit={handleSubmit}>
                <FormInputName />
                <FormInputPassword />
                <FormInputConfirmedPassword />
                <button type="submit">登録する</button>
            </form>
        </SignupFormContext.Provider>
    )
}
