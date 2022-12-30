import { Themes, useTheme } from "../../theme"

import { ChannelGroupObjectT, ChannelObjectT } from "../../../api/object"
import { ContentStateT } from "../../../state/chat/store/types/app_state"
import { DomainDataContext } from "../../../state/chat/store/domain_data"
import { useContext } from "react"

export const ChannelHeaderComponent = ({
    channel,
    theme,
}: {
    channel: ChannelObjectT
    theme: Themes
}) => {
    const getStyle = (theme: Themes) => {
        if (theme.global.current.light) {
            return {
                arrowColor: "#7d7d7d",
                hoverArrowColor: "#000",
                borderColor: "#eee",
                hoverBackgroundColor: "#f4f4f4",
            }
        }
        if (theme.global.current.dark) {
            return {
                arrowColor: "#6f767d",
                hoverArrowColor: "#fff",
                borderColor: "#141414",
                hoverBackgroundColor: "#101010",
            }
        }
        throw new Error()
    }
    return (
        <div className="header">
            <div className="channel-name-block">
                <span className="status">{channel.status_string}</span>
                <span className="name">{channel.name}</span>
                <svg className="arrow">
                    <use href="#icon-direction-down"></use>
                </svg>
            </div>
            <style jsx>{`
                .header {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    box-sizing: border-box;
                    box-sizing: border-box;
                    padding: 12px 0 12px 0;
                    margin: 0 16px;
                }
                .channel-name-block {
                    box-sizing: border-box;
                    padding: 6px 10px;
                    border-radius: 6px;
                    flex: 0 1 auto;
                    font-weight: 500;
                    cursor: pointer;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    transition: 0.05s;
                }
                .status {
                    margin-right: 6px;
                }
                .arrow {
                    width: 18px;
                    height: 18px;
                    text-align: center;
                    padding: 2px;
                    margin-left: 2px;
                    flex-shrink: 0;
                    stroke-width: 2px;
                }
            `}</style>
            <style jsx>{`
                .arrow {
                    stroke: ${getStyle(theme)["arrowColor"]};
                }
                .channel-name-block:hover {
                    background-color: ${getStyle(theme)["hoverBackgroundColor"]};
                }
                .channel-name-block:hover .arrow {
                    stroke: ${getStyle(theme)["hoverArrowColor"]};
                }
            `}</style>
        </div>
    )
}

export const ChannelGroupHeaderComponent = ({
    channelGroup,
    theme,
}: {
    channelGroup: ChannelGroupObjectT
    theme: Themes
}) => {
    const getStyle = (theme: Themes) => {
        if (theme.global.current.light) {
            return {
                color: "#000",
                iconColor: "#000",
            }
        }
        if (theme.global.current.dark) {
            return {
                color: "#fff",
                iconColor: "#a0a0a0",
            }
        }
        throw new Error()
    }
    return (
        <div className="header">
            <div className="name-container">
                <span className="name">{channelGroup.name}</span>
            </div>
            <div className="metadata-container">
                <div className="message-count">
                    <svg className="icon">
                        <use href="#icon-chat"></use>
                    </svg>
                    <span className="value">{channelGroup.message_count}</span>
                </div>
            </div>
            <style jsx>{`
                .header {
                    display: flex;
                    flex-direction: row;
                    box-sizing: border-box;
                    padding: 20px 20px 20px 10px;
                }
                .name-container {
                    flex: 1 1 auto;
                }
                .name {
                    font-size: 20px;
                    font-weight: bold;
                }
                .metadata-container {
                    flex: 0 0 auto;
                }
                .message-count {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                }
                .icon {
                    width: 18px;
                    height: 18px;
                    margin-right: 4px;
                    stroke-width: 0.5px;
                }
            `}</style>
            <style jsx>{`
                .header {
                    color: ${getStyle(theme)["color"]};
                }
                .icon {
                    fill: ${getStyle(theme)["iconColor"]};
                    stroke: ${getStyle(theme)["iconColor"]};
                }
            `}</style>
        </div>
    )
}

export const HeaderComponent = ({ content }: { content: ContentStateT }) => {
    const [theme] = useTheme()
    const domainData = useContext(DomainDataContext)
    if (content.context.channelId) {
        const channel = domainData.channels.get(content.context.channelId)
        if (channel) {
            return <ChannelHeaderComponent channel={channel} theme={theme} />
        }
    }
    if (content.context.channelGroupId) {
        const channelGroup = domainData.channelGroups.get(content.context.channelGroupId)
        if (channelGroup) {
            return <ChannelGroupHeaderComponent channelGroup={channelGroup} theme={theme} />
        }
    }
    return null
}
