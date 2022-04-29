import { ChannelGroupObjectT, ChannelObjectT } from "../../../api/object"
import {
    ChannelMenuModalActionContext,
    ChannelMenuModalStateContext,
    useChannelMenuModalState,
} from "../../../state/component/model/channel_menu"
import { Themes, useTheme } from "../../theme"

import { DomainDataContext } from "../../../state/chat/store/domain_data"
import classNames from "classnames"
import classnames from "classnames"
import { useContext } from "react"

export type ListItemObjectT = {
    channel: ChannelObjectT
    channel_group: ChannelGroupObjectT
}

export type ListItemT = {
    type: "channel" | "channel_group"
    object: ChannelObjectT | ChannelGroupObjectT
}

const getStyle = (theme: Themes) => {
    if (theme.global.current.light) {
        return {
            color: "#6f767d",
            hoverColor: "#090a0b",
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

const checkUnread = (channel: ChannelObjectT) => {
    if (channel.last_message == null) {
        return false
    }
    if (channel.read_state == null) {
        return false
    }
    if (channel.read_state.last_message == null) {
        return false
    }
    if (
        channel.last_message.created_at.getTime() >
        channel.read_state.last_message.created_at.getTime()
    ) {
        return true
    }
    return false
}

const ChannelListItem = ({ channel, active }: { channel: ChannelObjectT; active: boolean }) => {
    const [theme] = useTheme()
    const unread = checkUnread(channel)
    return (
        <>
            <a
                className={classnames("item", {
                    active,
                    unread,
                })}
                href={`/channel/${channel.unique_name}`}>
                <span className="status">{channel.status_string}</span>
                <span className="name">{channel.name}</span>
            </a>
            <style jsx>{`
                .item {
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
                .status {
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
                .item {
                    color: ${getStyle(theme)["color"]};
                }
                .item:hover {
                    color: ${getStyle(theme)["hoverColor"]};
                    background-color: ${getStyle(theme)["hoverBackgroundColor"]};
                }
                .item.active {
                    color: ${getStyle(theme)["hoverColor"]};
                    background-color: ${getStyle(theme)["hoverBackgroundColor"]};
                }
                .item.unread {
                    color: ${getStyle(theme)["hoverColor"]};
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
                <a href={`/group/${channelGroup.unique_name}`}>
                    <svg className="icon">
                        <use href="#icon-direction-right"></use>
                    </svg>
                    <span className="name">{channelGroup.name}</span>
                </a>
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
                    color: ${getStyle(theme)["color"]};
                }
                a:hover {
                    color: ${getStyle(theme)["hoverColor"]};
                    background-color: ${getStyle(theme)["hoverBackgroundColor"]};
                }
                .icon {
                    stroke: ${getStyle(theme)["color"]};
                }
                a:hover .icon {
                    stroke: ${getStyle(theme)["hoverColor"]};
                }
            `}</style>
        </>
    )
}

export const ChannelGroupSidebarComponent = ({
    channelIds,
    channelGroupIds,
    activeChannelId,
}: {
    channelIds: number[]
    channelGroupIds: number[]
    activeChannelId?: number
}) => {
    const [theme] = useTheme()
    const channelMenuModalAction = useContext(ChannelMenuModalActionContext)
    const isChannelMenuHidden = useContext(ChannelMenuModalStateContext)
    const domainData = useContext(DomainDataContext)
    const channels = []
    for (const channelId of channelIds) {
        const channel = domainData.channels.get(channelId)
        if (channel) {
            channels.push(channel)
        }
    }
    const channelGroups = []
    for (const channelGroupId of channelGroupIds) {
        const channelGroup = domainData.channelGroups.get(channelGroupId)
        if (channelGroup) {
            channelGroups.push(channelGroup)
        }
    }
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
            const active = activeChannelId ? activeChannelId == item.object.id : false
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
        <div
            className={classNames("item", {
                "show-toggle-channel-menu": isChannelMenuHidden == false,
            })}>
            <div className="header">
                <svg className="icon-down">
                    <use href="#icon-direction-down-solid"></use>
                </svg>
                <span className="label">チャンネル</span>
                <button
                    className="toggle-channel-menu"
                    onClick={(e) => {
                        e.preventDefault()
                        channelMenuModalAction.toggle(e)
                    }}>
                    <svg className="icon-menu-line-horizontal">
                        <use href="#icon-menu-line-horizontal"></use>
                    </svg>
                </button>
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
                    flex-direction: row;
                    align-items: center;
                    width: 100%;
                }
                .icon-down {
                    width: 16px;
                    height: 16px;
                    margin: 2px 6px 0 0;
                    text-align: center;
                    stroke-width: 0;
                    flex: 0 0 auto;
                }
                .label {
                    flex: 1 1 auto;
                }
                .toggle-channel-menu {
                    background: none;
                    border: none;
                    flex: 0 0 auto;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    cursor: pointer;
                    width: 30px;
                    height: 30px;
                    box-sizing: border-box;
                    border-radius: 6px;
                    visibility: hidden;
                    opacity: 0;
                    transition: 0.05s;
                    margin-top: 2px;
                }
                .item:hover .toggle-channel-menu,
                .item.show-toggle-channel-menu .toggle-channel-menu {
                    visibility: visible;
                    opacity: 1;
                }
                .icon-menu-line-horizontal {
                    transition: 0.05s;
                    flex: 0 0 auto;
                    width: 20px;
                    height: 20px;
                    stroke-width: 0;
                }
            `}</style>
            <style jsx global>{`
                .sidebar-channel-group-list:hover > a.item.active {
                    color: ${getStyle(theme)["hoverColor"]};
                    background-color: transparent;
                }
                .sidebar-channel-group-list:hover > a.item.active:hover {
                    color: ${getStyle(theme)["hoverColor"]};
                    background-color: ${getStyle(theme)["hoverBackgroundColor"]};
                }
            `}</style>
            <style jsx>{`
                .header {
                    color: ${getStyle(theme)["color"]};
                }
                .icon-down {
                    fill: ${getStyle(theme)["color"]};
                }
                .icon-menu-line-horizontal {
                    fill: ${getStyle(theme)["color"]};
                }
                .toggle-channel-menu:hover {
                    background-color: ${getStyle(theme)["hoverBackgroundColor"]};
                }
                .toggle-channel-menu:hover .icon-menu-line-horizontal {
                    fill: ${getStyle(theme)["hoverColor"]};
                }
            `}</style>
        </div>
    )
}
