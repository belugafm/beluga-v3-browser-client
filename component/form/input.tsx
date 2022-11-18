import { Themes, useTheme } from "../theme"

import classnames from "classnames"

type InputComponentAttributes = {
    name: string
    type: string
    value: string
    onChange: any
    label: string
    errorMessage: string[]
    hint: string[]
}

const getStyleForTheme = (theme: Themes) => {
    if (theme.global.current.light) {
        return {
            backgroundColor: "#f4f4f4",
            color: "#191919",
            focusBackgroundColor: "#fff",
            focusBorderColor: "#1a1f15",
        }
    }
    if (theme.global.current.dark) {
        return {
            backgroundColor: "#101010",
            borderColor: "#373737",
            color: "#fcfcfc",
            focusBackgroundColor: "#101010",
            focusBorderColor: "#2a85ff",
        }
    }
    throw new Error()
}

export const InputComponent = ({
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
                input {
                    border-radius: 8px;
                    border-width: 1px;
                    font-size: 16px;
                    padding: 0 10px;
                    height: 44px;
                    border: 2px solid transparent;
                    width: 100%;
                    box-sizing: border-box;
                    transition: 0.3s;
                    outline: none;
                }
                .input-component {
                    margin: auto;
                    margin-bottom: 20px;
                }
                .label {
                    display: block;
                    margin-bottom: 10px;
                    font-size: 16px;
                }
                .error-message {
                    display: none;
                }
                .input-component.error .error-message {
                    display: block;
                }
            `}</style>
            <style jsx>{`
                input {
                    color: ${getStyleForTheme(theme)["color"]};
                    background-color: ${getStyleForTheme(theme)["backgroundColor"]};
                    border-color: ${getStyleForTheme(theme)["borderColor"]};
                }
                input:focus {
                    border-color: ${getStyleForTheme(theme)["focusBorderColor"]};
                    background: ${getStyleForTheme(theme)["focusBackgroundColor"]};
                }
                .error-message {
                    color: red;
                }
            `}</style>
        </div>
    )
}
