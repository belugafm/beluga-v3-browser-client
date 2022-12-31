import classNames from "classnames"
import { Themes, useTheme } from "../theme"

const getStyle = (theme: Themes) => {
    if (theme.global.current.light) {
        return {
            primaryColor: "#323232",
            secondaryColor: "#000000",
            iconColor: "#464646",
            iconHoverColor: "#0a0a0a",
            arrowColor: "#000000",
            secondaryColorHoverColor: "#000000",
            secondaryColorHoverBgColor: "#e6e6e6",
        }
    }
    if (theme.global.current.dark) {
        return {
            primaryColor: "#959595",
            secondaryColor: "#ffffff",
            iconColor: "#959595",
            iconHoverColor: "#ffffff",
            arrowColor: "#ffffff",
            secondaryColorHoverColor: "#ffffff",
            secondaryColorHoverBgColor: "rgba(68,68,68,0.5)",
        }
    }
    throw new Error()
}

export const SettingsMenuComponent = () => {
    const [theme] = useTheme()
    const url = new URL(location.href)
    const components = url.pathname.split("/")
    console.log(components)

    return (
        <>
            <div className="primary-list-container">
                <div className="primary-list-item">アカウント</div>
                <div className="secondary-list-container">
                    <div
                        className={classNames("secondary-list-item", {
                            active: url.pathname == "/settings/account",
                        })}>
                        <a href="/settings/account">
                            <svg className="icon">
                                <use href="#icon-user-circle"></use>
                            </svg>
                            アカウント情報
                            <svg className="right-arrow">
                                <use href="#icon-direction-right"></use>
                            </svg>
                        </a>
                    </div>
                    <div
                        className={classNames("secondary-list-item", {
                            active: url.pathname == "/settings/password",
                        })}>
                        <a href="/settings/password">
                            <svg className="icon">
                                <use href="#icon-lock"></use>
                            </svg>
                            パスワードの変更
                            <svg className="right-arrow">
                                <use href="#icon-direction-right"></use>
                            </svg>
                        </a>
                    </div>
                </div>
                <div className="primary-list-item">セキュリティ</div>
                <div className="secondary-list-container">
                    <div
                        className={classNames("secondary-list-item", {
                            active: url.pathname == "/settings/sessions",
                        })}>
                        <a href="/settings/sessions">
                            <svg className="icon">
                                <use href="#icon-computer"></use>
                            </svg>
                            アプリとセッション
                            <svg className="right-arrow">
                                <use href="#icon-direction-right"></use>
                            </svg>
                        </a>
                    </div>
                </div>
                <div className="primary-list-item">安全</div>
                <div className="secondary-list-container">
                    <div
                        className={classNames("secondary-list-item", {
                            active: url.pathname == "/settings/mute",
                        })}>
                        <a href="/settings/mute">
                            <svg className="icon">
                                <use href="#icon-view-off"></use>
                            </svg>
                            ミュート
                            <svg className="right-arrow">
                                <use href="#icon-direction-right"></use>
                            </svg>
                        </a>
                    </div>
                    <div
                        className={classNames("secondary-list-item", {
                            active: url.pathname == "/settings/block",
                        })}>
                        <a href="/settings/block">
                            <svg className="icon">
                                <use href="#icon-do-not-disturb"></use>
                            </svg>
                            ブロック
                            <svg className="right-arrow">
                                <use href="#icon-direction-right"></use>
                            </svg>
                        </a>
                    </div>
                </div>
                <div className="primary-list-item">通知</div>
                <div className="secondary-list-container">
                    <div
                        className={classNames("secondary-list-item", {
                            active: url.pathname == "/settings/notifications/keywords",
                        })}>
                        <a href="/settings/notifications/keywords">
                            <svg className="icon">
                                <use href="#icon-font-size"></use>
                            </svg>
                            キーワード
                            <svg className="right-arrow">
                                <use href="#icon-direction-right"></use>
                            </svg>
                        </a>
                    </div>
                </div>
                <div className="primary-list-item">招待</div>
                <div className="secondary-list-container">
                    <div
                        className={classNames("secondary-list-item", {
                            active: url.pathname == "/settings/invite",
                        })}>
                        <a href="/settings/invite">
                            <svg className="icon">
                                <use href="#icon-user-add"></use>
                            </svg>
                            招待を作成
                            <svg className="right-arrow">
                                <use href="#icon-direction-right"></use>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
            <style jsx>{`
                .primary-list-container {
                    height: 100%;
                }
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
                    line-height: 20px;
                    text-decoration: none;
                    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
                    background-color: transparent;
                    transition: 0.05s;
                    overflow: hidden;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                }
                .primary-list-item {
                    font-size: 14px;
                    margin: 16px 0 8px 0;
                }
                .primary-list-item:first-child {
                    margin-top: 4px;
                }
                .secondary-list-container {
                }
                svg.icon {
                    margin-top: 1px;
                    width: 20px;
                    height: 20px;
                    flex-shrink: 0;
                    margin-right: 8px;
                }
                svg.right-arrow {
                    width: 20px;
                    height: 20px;
                    position: absolute;
                    right: 10px;
                    top: calc(50% - 10px);
                    display: none;
                }
            `}</style>
            <style jsx>{`
                .primary-list-item {
                    color: ${getStyle(theme)["primaryColor"]};
                }
                a {
                    color: ${getStyle(theme)["secondaryColor"]};
                }
                .secondary-list-item.active a {
                    color: ${getStyle(theme)["secondaryColorHoverColor"]};
                    background-color: ${getStyle(theme)["secondaryColorHoverBgColor"]};
                }
                svg.icon {
                    fill: ${getStyle(theme)["iconColor"]};
                    stroke: ${getStyle(theme)["iconColor"]};
                }
                .secondary-list-item.active a svg.icon,
                a:hover svg.icon {
                    fill: ${getStyle(theme)["iconHoverColor"]};
                    stroke: ${getStyle(theme)["iconHoverColor"]};
                }
                a:hover svg.right-arrow,
                .secondary-list-item.active a svg.right-arrow {
                    display: block;
                    fill: ${getStyle(theme)["arrowColor"]};
                    stroke: ${getStyle(theme)["arrowColor"]};
                }
                .primary-list-container:hover .secondary-list-item.active a {
                    color: ${getStyle(theme)["secondaryColor"]};
                    background-color: transparent;
                }
                .primary-list-container:hover .secondary-list-item.active svg.icon {
                    fill: ${getStyle(theme)["iconColor"]};
                    stroke: ${getStyle(theme)["iconColor"]};
                }
                .primary-list-container:hover .secondary-list-item.active svg.right-arrow {
                    display: none;
                }
                .primary-list-container:hover .secondary-list-item.active a:hover,
                a:hover {
                    color: ${getStyle(theme)["secondaryColorHoverColor"]};
                    background-color: ${getStyle(theme)["secondaryColorHoverBgColor"]};
                }
                .primary-list-container:hover .secondary-list-item.active a:hover svg.right-arrow {
                    display: block;
                    fill: ${getStyle(theme)["arrowColor"]};
                    stroke: ${getStyle(theme)["arrowColor"]};
                }
                .primary-list-container:hover .secondary-list-item.active a:hover svg.icon {
                    fill: ${getStyle(theme)["iconHoverColor"]};
                    stroke: ${getStyle(theme)["iconHoverColor"]};
                }
            `}</style>
        </>
    )
}
