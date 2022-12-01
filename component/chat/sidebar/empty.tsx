import { ChannelGroupId, ChannelId } from "../../../api/object"
import { Themes, useTheme } from "../../theme"

const getStyleForPanel = (theme: Themes) => {
    if (theme.global.current.light) {
        return {
            headerColor: "#6f767d",
            contentColor: "#090a0b",
            linkColor: "#2a85ff",
        }
    }
    if (theme.global.current.dark) {
        return {
            headerColor: "#6f767d",
            contentColor: "#fff",
            linkColor: "#2a85ff",
        }
    }
    throw new Error()
}

const getStyleForButton = (theme: Themes) => {
    if (theme.global.current.light) {
        return {
            color: "#1a1d1f",
            hoverColor: "#2a85ff",
            borderColor: "#fff",
            hoverBorderColor: "#2a85ff",
            backgroundColor: "#f4f4f4",
            hoverBackgroundColor: "#fff",
        }
    }
    if (theme.global.current.dark) {
        return {
            color: "#fcfcfc",
            hoverColor: "#fff",
            borderColor: "#111315",
            hoverBorderColor: "#2a85ff",
            backgroundColor: "#111315",
            hoverBackgroundColor: "#2a85ff",
        }
    }
    throw new Error()
}

export const EmptyComponent = ({
    channelIds,
    channelGroupIds,
    channelGroupId,
}: {
    channelIds: ChannelId[]
    channelGroupIds: ChannelGroupId[]
    channelGroupId: ChannelGroupId
}) => {
    const [theme] = useTheme()
    const components: JSX.Element[] = []
    if (channelIds.length == 0) {
        if (channelGroupIds.length == 0) {
            components.push(
                <div className="item" key="channelGroup">
                    <div className="header">
                        <span className="label">チャンネルグループ</span>
                    </div>
                    <div className="create-new">
                        <p>チャンネルグループがまだありません。</p>
                        <div className="link">
                            <a href={`/group/create?parent_id=${channelGroupId}`}>作成する</a>
                        </div>
                    </div>
                    <style jsx>{`
                        .item {
                            flex: 0 0 auto;
                        }
                        .header {
                            height: 40px;
                            font-size: 14px;
                            padding-left: 4px;
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                            width: 100%;
                        }
                        .label {
                            flex: 1 1 auto;
                            font-weight: 500;
                        }
                        .create-new {
                            padding: 0 16px;
                            margin: 0;
                            border-radius: 12px;
                            font-size: 15px;
                        }
                        p {
                            margin: 0;
                            padding: 0;
                            line-height: 1.5em;
                        }
                        .link {
                            position: relative;
                            margin-top: 4px;
                            padding-bottom: 38px;
                        }
                        a {
                            position: absolute;
                            right: 10px;
                            top: 0;
                            text-decoration: none;
                            display: block;
                            text-align: center;
                            border-radius: 8px;
                            border: 2px solid transparent;
                            box-sizing: border-box;
                            font-size: 15px;
                            font-weight: 500;
                            padding: 6px 12px;
                            font-size: 15px;
                        }
                        a:hover {
                        }
                    `}</style>
                    <style jsx>{`
                        .header {
                            color: ${getStyleForPanel(theme)["headerColor"]};
                        }
                        .create-new {
                            color: ${getStyleForPanel(theme)["contentColor"]};
                        }
                        a {
                            color: ${getStyleForButton(theme)["color"]};
                            border-color: ${getStyleForButton(theme)["borderColor"]};
                            background-color: ${getStyleForButton(theme)["backgroundColor"]};
                        }
                        a:hover {
                            color: ${getStyleForButton(theme)["hoverColor"]};
                            border-color: ${getStyleForButton(theme)["hoverBorderColor"]};
                            background-color: ${getStyleForButton(theme)["hoverBackgroundColor"]};
                        }
                    `}</style>
                </div>
            )
        }
        components.push(
            <div className="item" key="channel">
                <div className="header">
                    <span className="label">チャンネル</span>
                </div>
                <div className="create-new">
                    <p>チャンネルがまだありません。</p>
                    <div className="link">
                        <a href={`/channel/create?parent_id=${channelGroupId}`}>作成する</a>
                    </div>
                </div>
                <style jsx>{`
                    .item {
                        flex: 1 1 auto;
                    }
                    .header {
                        height: 40px;
                        font-size: 14px;
                        padding-left: 4px;
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        width: 100%;
                    }
                    .label {
                        flex: 1 1 auto;
                        font-weight: 500;
                    }
                    .create-new {
                        padding: 0 16px;
                        margin: 0;
                        border-radius: 12px;
                        font-size: 15px;
                    }
                    p {
                        margin: 0;
                        padding: 0;
                        line-height: 1.5em;
                    }
                    .link {
                        position: relative;
                        margin-top: 4px;
                        padding-bottom: 38px;
                    }
                    a {
                        position: absolute;
                        right: 10px;
                        top: 0;
                        text-decoration: none;
                        display: block;
                        text-align: center;
                        border-radius: 8px;
                        border: 2px solid transparent;
                        box-sizing: border-box;
                        font-size: 15px;
                        font-weight: 500;
                        padding: 6px 12px;
                        font-size: 15px;
                    }
                    a:hover {
                    }
                `}</style>
                <style jsx>{`
                    .header {
                        color: ${getStyleForPanel(theme)["headerColor"]};
                    }
                    .create-new {
                        color: ${getStyleForPanel(theme)["contentColor"]};
                    }
                    a {
                        color: ${getStyleForButton(theme)["color"]};
                        border-color: ${getStyleForButton(theme)["borderColor"]};
                        background-color: ${getStyleForButton(theme)["backgroundColor"]};
                    }
                    a:hover {
                        color: ${getStyleForButton(theme)["hoverColor"]};
                        border-color: ${getStyleForButton(theme)["hoverBorderColor"]};
                        background-color: ${getStyleForButton(theme)["hoverBackgroundColor"]};
                    }
                `}</style>
            </div>
        )
    }
    return <>{components}</>
}
