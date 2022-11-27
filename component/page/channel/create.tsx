import { CreateChannelFormContext, useCreateChannelFormState } from "../../../state/channel/create"
import { Themes, useTheme } from "../../theme"

import { BlueButton } from "../../form/button"
import { InputComponent } from "../../form/input"
import { useContext } from "react"
import { getStyleForTheme as getSidebarStyleForTheme } from "../../chat/sidebar"
import { getStyleForTheme as getContentStyleForTheme } from "../../chat/content/channel"
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
                <div className="page">
                    <div className="container">
                        <div className="title">チャンネルの新規作成</div>
                        <form method="POST" action="" onSubmit={handleSubmit}>
                            <NameInputForm />
                            <MinimumTrustRankForm />
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
            </CreateChannelFormContext.Provider>
        </>
    )
}
