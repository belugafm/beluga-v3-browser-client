import { ThemeT } from "../../../theme"

import { ChannelObjectT } from "../../../../../api/object"

export const ChannelHeaderComponent = ({
    channel,
    theme,
}: {
    channel: ChannelObjectT
    theme: ThemeT
}) => {
    const getStyle = (theme: ThemeT) => {
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
                    font-size: 16px;
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
