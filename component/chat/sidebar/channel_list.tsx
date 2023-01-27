import { ChannelObjectT } from "../../../api/object"
import {
    ChannelMenuModalActionContext,
    ChannelMenuModalStateContext,
} from "../../../state/component/model/channel_menu"
import { ThemeT, useTheme } from "../../theme"

import { DomainDataContext } from "../../../state/chat/store/domain_data"
import classnames from "classnames"
import { useContext } from "react"

const getStyle = (theme: ThemeT) => {
    if (theme.global.current.light) {
        return {
            color: "#7d7d7d",
            labelColor: "#323232",
            hoverColor: "#000000",
            hoverBackgroundColor: "#e6e6e6",
        }
    }
    if (theme.global.current.dark) {
        return {
            color: "#7d7d7d",
            labelColor: "#7d7d7d",
            hoverColor: "#fff",
            hoverBackgroundColor: "rgba(68,68,68,0.5)",
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
                    box-sizing: border-box;
                    font-size: 16px;
                    text-decoration: none;
                    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
                    background-color: transparent;
                    transition: 0.05s;
                    overflow: hidden;
                    white-space: nowrap;
                    font-weight: 400;
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
                    font-weight: 500;
                }
            `}</style>
        </>
    )
}

export const ChannelListComponent = ({
    channelIds,
    activeChannelId,
}: {
    channelIds: number[]
    activeChannelId?: number
}) => {
    const [theme] = useTheme()
    const channelMenuModalAction = useContext(ChannelMenuModalActionContext)
    const isChannelMenuHidden = useContext(ChannelMenuModalStateContext)
    const domainData = useContext(DomainDataContext)
    const channels: ChannelObjectT[] = []
    for (const channelId of channelIds) {
        const channel = domainData.channels.get(channelId)
        if (channel) {
            channels.push(channel)
        }
    }
    if (channels.length == 0) {
        return null
    }
    channels.sort((a, b) => {
        return a.name.localeCompare(b.name)
    })
    const listItemNodes = channels.map((channel, n) => {
        const active = activeChannelId ? activeChannelId == channel.id : false
        return <ChannelListItem key={n} active={active} channel={channel} />
    })
    return (
        <div
            className={classnames("item", {
                "show-toggle-channel-menu": isChannelMenuHidden == false,
            })}>
            <div className="header">
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
                .icon-down {
                    width: 14px;
                    height: 14px;
                    margin: 2px 6px 0 0;
                    text-align: center;
                    stroke-width: 0;
                    flex: 0 0 auto;
                }
                .label {
                    flex: 1 1 auto;
                    font-weight: 500;
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
                .label {
                    color: ${getStyle(theme)["labelColor"]};
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
