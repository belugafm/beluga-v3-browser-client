import { CreateChannelFormContext, useCreateChannelFormState } from "../../../state/channel/create"
import { Themes, useTheme } from "../../theme"

import { BlueButton } from "../../form/button"
import { InputComponent } from "../../form/input"
import { useContext } from "react"
import { getStyle as getSidebarStyleForTheme } from "../../layout/sidebar"
import { getStyle as getContentStyle } from "../../chat/content/channel"
import { ChannelGroupObjectT } from "../../../api/object"
import { TrustRank } from "../../../api/trust_rank"

const NameInputForm = () => {
    const { nameField, handleUpdateName } = useContext(CreateChannelFormContext)
    return (
        <InputComponent
            label="チャンネル名"
            type="text"
            name="channel_group_name"
            value={nameField.value}
            errorMessage={nameField.errorMessage}
            hint={nameField.hint}
            onChange={handleUpdateName}
        />
    )
}

const MinimumTrustRankForm = () => {
    const { minimumTrustRankField, handleUpdateMinimumTrustRank } =
        useContext(CreateChannelFormContext)
    return (
        <>
            <p>書き込みを許可する最低限の信用ランク</p>
            <select
                name="minimum_trust_rank"
                value={minimumTrustRankField.value}
                onChange={handleUpdateMinimumTrustRank}>
                <option value={TrustRank.Visitor}>ビジター</option>
                <option value={TrustRank.AuthorizedUser}>認証ユーザー</option>
                <option value={TrustRank.Moderator}>モデレーター</option>
                <option value={TrustRank.RiskyUser}>不審ユーザー</option>
            </select>
            <p>モデレーター ＞ 認証ユーザー ＞ ビジター ＞ 不審ユーザー</p>
            <p>通常はビジター以上でよい</p>
        </>
    )
}

export const CreateChannelFormComponent = ({
    channelGroup,
}: {
    channelGroup: ChannelGroupObjectT
}) => {
    const [theme] = useTheme()
    const {
        nameField,
        minimumTrustRankField,
        globalErrorMessageField,
        handleUpdateName,
        handleUpdateMinimumTrustRank,
        handleSubmit,
    } = useCreateChannelFormState(channelGroup)

    return (
        <>
            <CreateChannelFormContext.Provider
                value={{
                    nameField,
                    minimumTrustRankField,
                    globalErrorMessageField,
                    handleUpdateName,
                    handleUpdateMinimumTrustRank,
                }}>
                <div className="title">チャンネルの新規作成</div>
                <form method="POST" action="" onSubmit={handleSubmit}>
                    <NameInputForm />
                    <MinimumTrustRankForm />
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
                        background-color: ${getContentStyle(theme)["backgroundColor"]};
                        color: ${getContentStyle(theme)["color"]};
                        filter: ${getContentStyle(theme)["dropShadow"]};
                        border: ${getContentStyle(theme)["border"]};
                    }
                    .page {
                        background-color: ${getSidebarStyleForTheme(theme)["backgroundColor"]};
                    }
                `}</style>
            </CreateChannelFormContext.Provider>
        </>
    )
}
