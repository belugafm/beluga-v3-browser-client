import React, { useContext } from "react"
import classnames from "classnames"
import { useTheme } from "../../theme"
import {
    useChannelCreateFormState,
    CreateChannelFormContext,
} from "../../../models/channel/create"
import { useLoggedInUser } from "../../../models/session"

type InputComponentAttributes = {
    value: string
    onChange: any
    label: string
    errorMessage: string[]
    hint: string[]
}

const InputComponent = ({
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
            <input value={value} type="text" onChange={onChange} />
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

const TextareaComponent = ({
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
            <textarea onChange={onChange} value={value} />
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
    const { nameField, handleUpdateNameValue } = useContext(
        CreateChannelFormContext
    )
    return (
        <InputComponent
            label="チャンネル名"
            type="text"
            value={nameField.value}
            errorMessage={nameField.errorMessage}
            hint={nameField.hint}
            onChange={handleUpdateNameValue}
        />
    )
}
const DescriptionInputForm = () => {
    const { descriptionField, handleUpdateDescriptionValue } = useContext(
        CreateChannelFormContext
    )
    return (
        <TextareaComponent
            label="チャンネルの説明"
            value={descriptionField.value}
            errorMessage={descriptionField.errorMessage}
            hint={descriptionField.hint}
            onChange={handleUpdateDescriptionValue}
        />
    )
}

const IsPublicCheckbox = () => {
    const [theme] = useTheme()
    const { isPublicField, handleUpdateIsPublicChecked } = useContext(
        CreateChannelFormContext
    )
    return (
        <div>
            <label>
                <input
                    type="checkbox"
                    name="is_public"
                    checked={isPublicField.checked}
                    onChange={handleUpdateIsPublicChecked}
                />
                パブリック
            </label>
            <p className="hint">
                パブリックに設定すると、このチャンネルの投稿はグローバルタイムラインやコミュニティタイムラインに表示されます
            </p>
            {isPublicField.errorMessage.map((line, index) => {
                return (
                    <p key={index} className="error-message">
                        {line}
                    </p>
                )
            })}
            {isPublicField.hint.map((line, index) => {
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
    const { globalErrorMessageField } = useContext(CreateChannelFormContext)
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

export const CreateChannelFormComponent = () => {
    const {
        nameField,
        descriptionField,
        globalErrorMessageField,
        isPublicField,
        handleUpdateNameValue,
        handleUpdateDescriptionValue,
        handleUpdateIsPublicChecked,
        handleSubmit,
    } = useChannelCreateFormState()

    return (
        <CreateChannelFormContext.Provider
            value={{
                nameField,
                descriptionField,
                globalErrorMessageField,
                isPublicField,
                handleUpdateNameValue,
                handleUpdateDescriptionValue,
                handleUpdateIsPublicChecked,
            }}>
            <form method="POST" action="" onSubmit={handleSubmit}>
                <GlobalErrorMessageComponent />
                <NameInputForm />
                <DescriptionInputForm />
                <IsPublicCheckbox />
                <button type="submit">チャンネルを作成</button>
            </form>
        </CreateChannelFormContext.Provider>
    )
}
