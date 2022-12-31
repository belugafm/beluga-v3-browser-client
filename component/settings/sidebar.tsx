import { useTheme } from "../theme"

const getStyle = (theme: Themes) => {
    if (theme.global.current.light) {
        return {
            primaryColor: "#323232",
            secondaryColor: "#000000",
            iconColor: "#323232",
            iconHoverColor: "#323232",
            hoverColor: "#000000",
            hoverBackgroundColor: "#e6e6e6",
        }
    }
    if (theme.global.current.dark) {
        return {
            primaryColor: "#959595",
            secondaryColor: "#ffffff",
            iconColor: "#959595",
            iconHoverColor: "#ffffff",
            hoverColor: "#fff",
            hoverBackgroundColor: "rgba(68,68,68,0.5)",
        }
    }
    throw new Error()
}

export const SettingsMenuComponent = () => {
    const [theme] = useTheme()
    return (
        <>
            <div className="primary-list-container">
                <div className="primary-list-item">アカウント</div>
                <div className="secondary-list-container">
                    <div className="secondary-list-item">
                        <a href="">
                            <svg>
                                <use href="#icon-user-circle"></use>
                            </svg>
                            アカウント情報
                        </a>
                    </div>
                    <div className="secondary-list-item">
                        <a href="">
                            <svg>
                                <use href="#icon-lock"></use>
                            </svg>
                            パスワードの変更
                        </a>
                    </div>
                </div>
                <div className="primary-list-item">セキュリティ</div>
                <div className="secondary-list-container">
                    <div className="secondary-list-item">
                        <a href="">
                            <svg>
                                <use href="#icon-computer"></use>
                            </svg>
                            アプリとセッション
                        </a>
                    </div>
                </div>
                <div className="primary-list-item">安全</div>
                <div className="secondary-list-container">
                    <div className="secondary-list-item">
                        <a href="">
                            <svg>
                                <use href="#icon-view-off"></use>
                            </svg>
                            ミュート
                        </a>
                    </div>
                    <div className="secondary-list-item">
                        <a href="">
                            <svg>
                                <use href="#icon-do-not-disturb"></use>
                            </svg>
                            ブロック
                        </a>
                    </div>
                </div>
                <div className="primary-list-item">通知</div>
                <div className="secondary-list-container">
                    <div className="secondary-list-item">
                        <a href="">
                            <svg>
                                <use href="#icon-telegram"></use>
                            </svg>
                            キーワード
                        </a>
                    </div>
                </div>
                <div className="primary-list-item">招待</div>
                <div className="secondary-list-container">
                    <div className="secondary-list-item">
                        <a href="">
                            <svg>
                                <use href="#icon-user-add"></use>
                            </svg>
                            招待を作成
                        </a>
                    </div>
                </div>
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
                    margin: 16px 0 4px 0;
                }
                .primary-list-item:first-child {
                    margin-top: 4px;
                }
                .secondary-list-container {
                }
                svg {
                    margin-top: 1px;
                    width: 20px;
                    height: 20px;
                    flex-shrink: 0;
                    margin-right: 8px;
                }
            `}</style>
            <style jsx>{`
                .primary-list-item {
                    color: ${getStyle(theme)["primaryColor"]};
                }
                a {
                    color: ${getStyle(theme)["secondaryColor"]};
                }
                a:hover {
                    color: ${getStyle(theme)["hoverColor"]};
                    background-color: ${getStyle(theme)["hoverBackgroundColor"]};
                }
                .icon {
                    fill: ${getStyle(theme)["color"]};
                    stroke: ${getStyle(theme)["color"]};
                }
                svg {
                    fill: ${getStyle(theme)["iconColor"]};
                    stroke: ${getStyle(theme)["iconColor"]};
                }
                a:hover svg {
                    fill: ${getStyle(theme)["iconHoverColor"]};
                    stroke: ${getStyle(theme)["iconHoverColor"]};
                }
            `}</style>
        </>
    )
}
