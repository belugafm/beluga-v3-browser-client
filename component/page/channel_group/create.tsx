import {
    CreateChannelGroupFormContext,
    useCreateChannelGroupFormState,
} from "../../../state/channel_group/create"
import { Themes, useTheme } from "../../theme"

import { BlueButton } from "../../form/button"
import { InputComponent } from "../../form/input"
import { useContext } from "react"
import { getStyleForTheme as getSidebarStyleForTheme } from "../../chat/sidebar"
import { getStyleForTheme as getContentStyleForTheme } from "../../chat/content/channel"

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
                        <form method="POST" action="" onSubmit={handleSubmit}>
                            <NameInputForm />
                            <div className="button-container">
                                <BlueButton type="submit">作成する</BlueButton>
                            </div>
                        </form>
                    </div>
                </div>
                <style jsx>{`
                    .page {
                        flex: 0 1 700px;
                        display: flex;
                        flex-direction: column;
                        z-index: 1;
                        border-radius: 0 12px 12px 0;
                        padding: 16px;
                        box-sizing: border-box;
                    }
                    .container {
                        flex: 1 1 auto;
                        min-height: 0;
                        display: flex;
                        flex-direction: column;
                        border-radius: 8px;
                        padding: 16px;
                        box-sizing: border-box;
                    }
                    .title {
                        margin-bottom: 24px;
                        font-size: 20px;
                        font-weight: bold;
                    }
                    .card {
                        position: relative;
                        padding: 24px;
                        border-radius: 8px;
                    }
                `}</style>
                <style jsx>{`
                    .container {
                        background-color: ${getContentStyleForTheme(theme)["backgroundColor"]};
                        color: ${getContentStyleForTheme(theme)["color"]};
                        filter: ${getContentStyleForTheme(theme)["dropShadow"]};
                        border: ${getContentStyleForTheme(theme)["border"]};
                    }
                    .page {
                        background-color: ${getSidebarStyleForTheme(theme)["backgroundColor"]};
                    }
                `}</style>
            </CreateChannelGroupFormContext.Provider>
        </>
    )
}
