import {
    CreateChannelGroupFormContext,
    useCreateChannelGroupFormState,
} from "../../../../state/channel_group/create"
import { useTheme } from "../../../../component/Theme"

import { BlueButton } from "../../../../component/desktop/form/Button"
import { InputComponent } from "../../../../component/desktop/form/Input"
import { useContext } from "react"
import { getStyle as getSidebarStyleForTheme } from "../../../../component/desktop/layout/Sidebar"
import { getStyle as getContentStyleForTheme } from "../../../../component/desktop/chat/content/columns/Channel"

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

export const FormComponent = ({ parentId }) => {
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
