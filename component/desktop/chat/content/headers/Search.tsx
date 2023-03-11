import { ThemeT } from "../../../../Theme"

import { ChannelGroupObjectT } from "../../../../../api/object"

export const ChannelGroupHeaderComponent = ({
    channelGroup,
    theme,
}: {
    channelGroup: ChannelGroupObjectT
    theme: ThemeT
}) => {
    const getStyle = (theme: ThemeT) => {
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
