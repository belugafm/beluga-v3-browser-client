import {
    CreateChannelGroupFormContext,
    useCreateChannelGroupFormState,
} from "../../../state/channel_group/create"
import { Themes, useTheme } from "../../theme"

import { BlueButton } from "../../form/button"
import { InputComponent } from "../../form/input"
import { useContext } from "react"

const getStyleForTheme = (theme: Themes) => {
    if (theme.global.current.light || theme.global.current.lightWithBgImage) {
        return {
            backgroundColor: "#fff",
            color: "#383838",
        }
    }
    if (theme.global.current.dark || theme.global.current.darkWithBgImage) {
        return {
            backgroundColor: "#1a1c1f",
            color: "#f0f0f0",
        }
    }
    throw new Error()
}

const NameInputForm = () => {
    const { nameField, handleUpdateNameValue } = useContext(CreateChannelGroupFormContext)
    return (
        <InputComponent
            label="チャンネルグループ名"
            type="text"
            name="channel_group_name"
            value={nameField.value}
            errorMessage={nameField.errorMessage}
            hint={nameField.hint}
            onChange={handleUpdateNameValue}
        />
    )
}

export const CreateChannelGroupFormComponent = ({ parentId }) => {
    const [theme] = useTheme()
    const { nameField, globalErrorMessageField, handleUpdateNameValue, handleSubmit } =
        useCreateChannelGroupFormState(parentId)

    return (
        <>
            <CreateChannelGroupFormContext.Provider
                value={{
                    nameField,
                    globalErrorMessageField,
                    handleUpdateNameValue,
                }}>
                <div className="page">
                    <div className="container">
                        <div className="title">チャンネルグループの新規作成</div>
                        <div className="create-channel-group">
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
            </CreateChannelGroupFormContext.Provider>
        </>
    )
}
