import { Themes, useTheme } from "../../theme"

import { ContentStateT } from "../../../state/chat/store/app_state"
import { DomainDataContext } from "../../../state/chat/store/domain_data"
import { useContext } from "react"

const getStyleForTheme = (theme: Themes) => {
    if (theme.global.current.light) {
        return {
            color: "#6f767d",
            boxShadow: "0 0 10px 10px rgba(255, 255, 255, 0.5)",
        }
    }
    if (theme.global.current.dark) {
        return {
            color: "#6f767d",
            boxShadow: "0 0 20px 10px rgba(26, 28, 31, 1)",
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
                    <span className="status">{channel.status_string}</span>
                    <span className="name">{channel.name}</span>
                    <style jsx>{`
                        .header {
                            padding: 16px;
                        }
                        .status {
                            margin-right: 6px;
                        }
                    `}</style>
                    <style jsx>{`
                        .header {
                            box-shadow: ${getStyleForTheme(theme)["boxShadow"]};
                        }
                    `}</style>
                </div>
            )
        }
    }
}
