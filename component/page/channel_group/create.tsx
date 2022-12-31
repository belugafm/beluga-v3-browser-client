import {
    CreateChannelGroupFormContext,
    useCreateChannelGroupFormState,
} from "../../../state/channel_group/create"
import { useTheme } from "../../theme"

import { BlueButton } from "../../form/button"
import { InputComponent } from "../../form/input"
import { useContext } from "react"
import { getStyle as getSidebarStyleForTheme } from "../../layout/sidebar"
import { getStyle as getContentStyleForTheme } from "../../chat/content/channel"

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
                <div className="title">チャンネルグループの新規作成</div>
                <form method="POST" action="" onSubmit={handleSubmit}>
                    <NameInputForm />
                    <div className="button-container">
                        <BlueButton type="submit">作成する</BlueButton>
                    </div>
                </form>
                <style jsx>{`
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
