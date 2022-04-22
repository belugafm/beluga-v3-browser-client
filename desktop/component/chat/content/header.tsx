import { Themes, useTheme } from "../../theme"

import { ContentStateT } from "../../../state/chat/store/types/app_state"
import { DomainDataContext } from "../../../state/chat/store/domain_data"
import { useContext } from "react"

const getStyle = (theme: Themes) => {
    if (theme.global.current.light) {
        return {
            arrowColor: "#6f767d",
            hoverArrowColor: "#000",
            boxShadow: "0 0 10px 10px rgba(255, 255, 255, 0.5)",
            hoverBackgroundColor: "#f4f4f4",
        }
    }
    if (theme.global.current.dark) {
        return {
            arrowColor: "#6f767d",
            hoverArrowColor: "#fff",
            boxShadow: "0 0 20px 10px rgba(26, 28, 31, 1)",
            hoverBackgroundColor: "#111315",
        }
    }
    throw new Error()
}

export const HeaderComponent = ({ content }: { content: ContentStateT }) => {
    const [theme] = useTheme()
    const domainData = useContext(DomainDataContext)
    if (content.context.channelId) {
        const channel = domainData.channels.get(content.context.channelId)
        if (channel) {
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
                            height: 56px;
                            box-sizing: border-box;
                            padding: 0 8px;
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
                        .header {
                            box-shadow: ${getStyle(theme)["boxShadow"]};
                        }
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
    }
    return null
}