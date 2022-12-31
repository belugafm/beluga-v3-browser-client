import { useTheme } from "../theme"

const getStyle = (theme: Themes) => {
    if (theme.global.current.light) {
        return {
            color: "#646464",
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

export const SideberMenuComponent = ({
    channelIds,
    activeChannelId,
}: {
    channelIds: number[]
    activeChannelId?: number
}) => {
    const [theme] = useTheme()
    return (
        <div>
            <div className="header">
                <span className="label">チャンネル</span>
            </div>
            <div className="list sidebar-channel-group-list"></div>
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
