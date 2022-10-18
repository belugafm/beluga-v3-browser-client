import {
    ChannelMenuModalActionContext,
    ChannelMenuModalStateContext,
} from "../../../state/component/model/channel_menu"
import { Themes, useTheme } from "../../theme"

import { ChannelGroupId, ChannelGroupObjectT } from "../../../api/object"
import { DomainDataContext } from "../../../state/chat/store/domain_data"
import { Random } from "../message/avatar"
import classnames from "classnames"
import { useContext } from "react"

const getStyle = (theme: Themes) => {
    if (theme.global.current.light || theme.global.current.lightWithBgImage) {
        return {
            color: "#6f767d",
            hoverColor: "#090a0b",
            hoverBackgroundColor: "#f4f4f4",
        }
    }
    if (theme.global.current.dark || theme.global.current.darkWithBgImage) {
        return {
            color: "#6f767d",
            hoverColor: "#fff",
            hoverBackgroundColor: "#111315",
        }
    }
    throw new Error()
}

const ImageComponent = ({
    channelGroupId,
    imageUrl,
}: {
    channelGroupId: ChannelGroupId
    imageUrl: string | null
}) => {
    if (imageUrl != null) {
        return (
            <>
                <img src={imageUrl}></img>
                <style jsx>{`
                    img {
                        mask: url('data:image/svg+xml;utf8,<svg preserveAspectRatio="none" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M 0, 100 C 0, 23 23, 0 100, 0 S 200, 23 200, 100 177, 200 100, 200 0, 177 0, 100" fill="white"></path></svg>');
                        mask-size: 100% 100%;
                    }
                `}</style>
            </>
        )
    }
    const gen = new Random(channelGroupId)
    const hue = 360 * gen.next()
    const sat = 50
    const lightness = 70
    return (
        <>
            <img />
            <style jsx>{`
                img {
                    width: 30px;
                    height: 30px;
                    mask: url('data:image/svg+xml;utf8,<svg preserveAspectRatio="none" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M 0, 100 C 0, 23 23, 0 100, 0 S 200, 23 200, 100 177, 200 100, 200 0, 177 0, 100" fill="white"></path></svg>');
                    mask-size: 100% 100%;
                    -webkit-mask-image: url('data:image/svg+xml;utf8,<svg preserveAspectRatio="none" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M 0, 100 C 0, 23 23, 0 100, 0 S 200, 23 200, 100 177, 200 100, 200 0, 177 0, 100" fill="white"></path></svg>');
                    border-radius: 0;
                    margin-top: 2px;
                    flex: 0 0 30px;
                }
            `}</style>
            <style jsx>{`
                img {
                    background-color: hsl(${hue}deg, ${sat}%, ${lightness}%);
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
                    <ImageComponent
                        imageUrl={channelGroup.image_url}
                        channelGroupId={channelGroup.id}
                    />
                    <div className="meta">
                        <div className="name">{channelGroup.name}</div>
                        {channelGroup.description == null ? null : (
                            <div className="description">{channelGroup.description}</div>
                        )}
                    </div>
                </a>
                <div className="children hidden"></div>
            </div>
            <style jsx>{`
                a {
                    position: relative;
                    display: flex;
                    align-items: center;
                    width: 100%;
                    height: 42px;
                    padding: 1px 12px;
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
                .meta {
                    flex: 1 1 auto;
                    margin-left: 10px;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }
                .name {
                    flex: 0 0 auto;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    font-weight: 500;
                    font-size: 15px;
                    line-height: 15px;
                }
                .description {
                    margin-top: 3px;
                    flex: 0 0 auto;
                    font-weight: 300;
                    font-size: 13px;
                    line-height: 13px;
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
                    fill: ${getStyle(theme)["color"]};
                    stroke: ${getStyle(theme)["color"]};
                }
                a:hover .icon {
                    fill: ${getStyle(theme)["hoverColor"]};
                    stroke: ${getStyle(theme)["hoverColor"]};
                }
            `}</style>
        </>
    )
}

export const ChannelGroupListComponent = ({ channelGroupIds }: { channelGroupIds: number[] }) => {
    const [theme] = useTheme()
    const channelMenuModalAction = useContext(ChannelMenuModalActionContext)
    const isChannelMenuHidden = useContext(ChannelMenuModalStateContext)
    const domainData = useContext(DomainDataContext)
    const channelGroups: ChannelGroupObjectT[] = []
    for (const channelGroupId of channelGroupIds) {
        const channelGroup = domainData.channelGroups.get(channelGroupId)
        if (channelGroup) {
            channelGroups.push(channelGroup)
        }
    }
    if (channelGroups.length == 0) {
        return null
    }
    channelGroups.sort((a, b) => {
        return a.name.localeCompare(b.name)
    })
    const listItemNodes = channelGroups.map((channelGroup, n) => {
        return <ChannelGroupListItem key={n} channelGroup={channelGroup} />
    })
    return (
        <div
            className={classnames("item", {
                "show-toggle-channel-menu": isChannelMenuHidden == false,
            })}>
            <div className="header">
                <span className="label">チャンネルグループ</span>
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
