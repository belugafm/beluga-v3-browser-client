import { ChannelGroupObjectT, ChannelObjectT } from "../../../api/object"
import { Themes, useTheme } from "../../theme"

import Link from "next/link"
import classnames from "classnames"

export type ListItemObjectT = {
    channel: ChannelObjectT
    channel_group: ChannelGroupObjectT
}

export type ListItemT = {
    type: "channel" | "channel_group"
    object: ChannelObjectT | ChannelGroupObjectT
}

const getStyleForTheme = (theme: Themes) => {
    if (theme.global.current.light) {
        return {
            color: "#6f767d",
            hoverColor: "#1a1d1f",
            hoverBackgroundColor: "#f4f4f4",
        }
    }
    if (theme.global.current.dark) {
        return {
            color: "#6f767d",
            hoverColor: "#fff",
            hoverBackgroundColor: "#111315",
        }
    }
    throw new Error()
}

const ChannelListItem = ({ channel, active }: { channel: ChannelObjectT; active: boolean }) => {
    const [theme] = useTheme()
    return (
        <>
            <Link href={`/channel/${channel.unique_name}`}>
                <a
                    className={classnames("item", {
                        active,
                    })}>
                    <span className="icon">{channel.status_string}</span>
                    <span className="name">{channel.name}</span>
                </a>
            </Link>
            <style jsx>{`
                a {
                    position: relative;
                    display: flex;
                    align-items: center;
                    width: 100%;
                    height: 36px;
                    padding: 0 12px;
                    border-radius: 8px;
                    white-space: nowrap;
                    box-sizing: border-box;
                    font-size: 16px;
                    text-decoration: none;
                    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
                    background-color: transparent;
                    transition: 0.05s;
                    overflow: hidden;
                    white-space: nowrap;
                }
                .icon {
                    width: 24px;
                    height: 24px;
                    text-align: center;
                    padding-right: 6px;
                    flex-shrink: 0;
                }
                .name {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            `}</style>
            <style jsx>{`
                a {
                    color: ${getStyleForTheme(theme)["color"]};
                }
                a:hover {
                    color: ${getStyleForTheme(theme)["hoverColor"]};
                    background-color: ${getStyleForTheme(theme)["hoverBackgroundColor"]};
                }
                a.active {
                    color: ${getStyleForTheme(theme)["hoverColor"]};
                    background-color: ${getStyleForTheme(theme)["hoverBackgroundColor"]};
                }
            `}</style>
        </>
    )
}

const ChannelGroupListItem = ({ channelGroup }: { channelGroup: ChannelGroupObjectT }) => {
    const [theme] = useTheme()
    return (
        <>
            <div className="container">
                <Link href={`/group/${channelGroup.unique_name}`}>
                    <a>
                        <svg className="icon">
                            <use href="#icon-direction-right"></use>
                        </svg>
                        <span className="name">{channelGroup.name}</span>
                    </a>
                </Link>
                <div className="children hidden"></div>
            </div>
            <style jsx>{`
                a {
                    position: relative;
                    display: flex;
                    align-items: center;
                    width: 100%;
                    height: 40px;
                    padding: 0 12px;
                    border-radius: 8px;
                    white-space: nowrap;
                    box-sizing: border-box;
                    font-size: 16px;
                    text-decoration: none;
                    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
                    background-color: transparent;
                    transition: 0.05s;
                    overflow: hidden;
                }
                .icon {
                    width: 20px;
                    height: 20px;
                    text-align: center;
                    padding: 2px;
                    margin-right: 6px;
                    flex-shrink: 0;
                    stroke-width: 2.5px;
                }
                .name {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .hidden {
                    display: none;
                }
            `}</style>
            <style jsx>{`
                a {
                    color: ${getStyleForTheme(theme)["color"]};
                }
                a:hover {
                    color: ${getStyleForTheme(theme)["hoverColor"]};
                    background-color: ${getStyleForTheme(theme)["hoverBackgroundColor"]};
                }
                .icon {
                    stroke: ${getStyleForTheme(theme)["color"]};
                }
                a:hover .icon {
                    stroke: ${getStyleForTheme(theme)["hoverColor"]};
                }
            `}</style>
        </>
    )
}

export const ChannelGroupSidebarComponent = ({
    channels,
    channelGroups,
    activeChannel,
}: {
    channels: ChannelObjectT[]
    channelGroups: ChannelGroupObjectT[]
    activeChannel?: ChannelObjectT
}) => {
    const [theme] = useTheme()
    const listItems: ListItemT[] = []
    channels.forEach((channel) => {
        listItems.push({
            type: "channel",
            object: channel,
        })
    })
    channelGroups.forEach((channelGroup) => {
        listItems.push({
            type: "channel_group",
            object: channelGroup,
        })
    })
    listItems.sort((a, b) => {
        return a["object"].name.localeCompare(b["object"].name)
    })
    const listItemNodes = []
    for (let n = 0; n < listItems.length; n++) {
        const item = listItems[n]
        if (item.type == "channel") {
            const active = activeChannel ? activeChannel.id == item.object.id : false
            listItemNodes.push(
                <ChannelListItem key={n} active={active} channel={item.object as ChannelObjectT} />
            )
        }
        if (item.type == "channel_group") {
            listItemNodes.push(
                <ChannelGroupListItem key={n} channelGroup={item.object as ChannelGroupObjectT} />
            )
        }
    }
    return (
        <div className="item">
            <div className="header">
                <svg className="icon">
                    <use href="#icon-direction-down-solid"></use>
                </svg>
                <span className="label">チャンネル</span>
            </div>
            <div className="list sidebar-channel-group-list">{listItemNodes}</div>
            <style jsx>{`
                .item {
                    font-weight: 500;
                }
                .header {
                    height: 40px;
                    font-size: 16px;
                    display: flex;
                    align-items: center;
                    width: 100%;
                }
                .icon {
                    width: 16px;
                    height: 16px;
                    margin: 2px 6px 0 0;
                    text-align: center;
                    stroke-width: 0;
                }
            `}</style>
            <style jsx global>{`
                .sidebar-channel-group-list:hover > a.item.active {
                    color: ${getStyleForTheme(theme)["hoverColor"]};
                    background-color: transparent;
                }
                .sidebar-channel-group-list:hover > a.item.active:hover {
                    color: ${getStyleForTheme(theme)["hoverColor"]};
                    background-color: ${getStyleForTheme(theme)["hoverBackgroundColor"]};
                }
            `}</style>
            <style jsx>{`
                .header {
                    color: ${getStyleForTheme(theme)["color"]};
                }
                .icon {
                    fill: ${getStyleForTheme(theme)["color"]};
                }
            `}</style>
        </div>
    )
}
