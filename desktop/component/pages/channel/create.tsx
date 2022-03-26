import { CreateChannelFormContext, useCreateChannelFormState } from "../../../state/channel/create"
import { Themes, useTheme } from "../../theme"

import { BlueButton } from "../../forms/button"
import { InputComponent } from "../../forms/input"
import { useContext } from "react"

const getStyleForTheme = (theme: Themes) => {
    if (theme.global.current.light) {
        return {
            backgroundColor: "#fff",
            color: "#383838",
        }
    }
    if (theme.global.current.dark) {
        return {
            backgroundColor: "#1a1c1f",
            color: "#f0f0f0",
        }
    }
    throw new Error()
}

const NameInputForm = () => {
    const { nameField, handleUpdateNameValue } = useContext(CreateChannelFormContext)
    return (
        <InputComponent
            label="チャンネル名"
            type="text"
            name="channel_group_name"
            value={nameField.value}
            errorMessage={nameField.errorMessage}
            hint={nameField.hint}
            onChange={handleUpdateNameValue}
        />
    )
}

export const CreateChannelFormComponent = ({ parentChannelGroupId }) => {
    const [theme] = useTheme()
    const { nameField, globalErrorMessageField, handleUpdateNameValue, handleSubmit } =
        useCreateChannelFormState(parentChannelGroupId)

    return (
        <>
            <CreateChannelFormContext.Provider
                value={{
                    nameField,
                    globalErrorMessageField,
                    handleUpdateNameValue,
                }}>
                <div className="page">
                    <div className="container">
                        <div className="title">チャンネルの新規作成</div>
                        <div className="create-channel">
                            <div className="card">
                                <form method="POST" action="" onSubmit={handleSubmit}>
                                    <NameInputForm />
                                    <div className="button-container">
                                        <BlueButton type="submit">作成する</BlueButton>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <style jsx>{`
                    .page {
                        display: flex;
                        flex-direction: column;
                        height: calc(100vh - 80px);
                        padding: 40px;
                        max-width: 800px;
                        margin: 0 auto;
                        box-sizing: border-box;
                    }
                    .container {
                        display: flex;
                        flex-direction: column;
                        flex-grow: 1;
                        width: 100%;
                        margin: 0 auto;
                    }
                    .title {
                        margin-bottom: 24px;
                        font-size: 30px;
                        font-weight: 500;
                    }
                    .card {
                        position: relative;
                        padding: 24px;
                        border-radius: 8px;
                    }
                `}</style>
                <style jsx>{`
                    .card {
                        background-color: ${getStyleForTheme(theme)["backgroundColor"]};
                        color: ${getStyleForTheme(theme)["color"]};
                    }
                `}</style>
            </CreateChannelFormContext.Provider>
        </>
    )
}
