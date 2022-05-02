import { Themes, useTheme } from "../../theme"

const getStyleForTheme = (theme: Themes) => {
    if (theme.global.current.light) {
        return {
            color: "#6f767d",
            hoverColor: "#1a1d1f",
            hoverBackgroundColor: "#f4f4f4",
            fill: "#6f767d",
            hoverFill: "#1a1d1f",
        }
    }
    if (theme.global.current.dark) {
        return {
            color: "#6f767d",
            hoverColor: "#fff",
            hoverBackgroundColor: "#111315",
            fill: "#6f767d",
            hoverFill: "#fff",
        }
    }
    throw new Error()
}

export const AccountMenuSidebarComponent = () => {
    const [theme] = useTheme()
    return (
        <div className="item">
            <div className="list">
                <a href="">
                    <svg className="icon">
                        <use href="#icon-home"></use>
                    </svg>
                    <span className="name">ホーム</span>
                </a>
                <a href="">
                    <svg className="icon">
                        <use href="#icon-chat"></use>
                    </svg>
                    <span className="name">スレッド</span>
                </a>
                <a href="">
                    <svg className="icon at">
                        <use href="#icon-at"></use>
                    </svg>
                    <span className="name">通知</span>
                </a>
            </div>
            <style jsx>{`
                .item {
                    margin-bottom: 12px;
                }
                a {
                    position: relative;
                    display: flex;
                    align-items: center;
                    width: 100%;
                    height: 36px;
                    line-height: 36px;
                    padding: 0 12px;
                    border-radius: 8px;
                    white-space: nowrap;
                    box-sizing: border-box;
                    font-size: 16px;
                    font-weight: 500;
                    text-decoration: none;
                    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
                    background-color: transparent;
                    transition: 0.05s;
                    overflow: hidden;
                    font-weight: 400;
                }
                .icon {
                    width: 20px;
                    height: 20px;
                    text-align: center;
                    margin-right: 12px;
                    flex-shrink: 0;
                    stroke-width: 0.5px;
                }
                .icon.at {
                    stroke-width: 0;
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
                .icon {
                    fill: ${getStyleForTheme(theme)["fill"]};
                    stroke: ${getStyleForTheme(theme)["fill"]};
                }
                a:hover .icon {
                    fill: ${getStyleForTheme(theme)["hoverFill"]};
                    stroke: ${getStyleForTheme(theme)["hoverFill"]};
                }
            `}</style>
        </div>
    )
}
