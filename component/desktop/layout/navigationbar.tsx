import { ThemeT, useTheme } from "../../theme"

const getStyleForTheme = (theme: ThemeT) => {
    if (theme.global.current.light) {
        return {
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            modalBackgroundColor: "rgb(17, 17, 17, 1)",
            buttonHoverBgColor: "rgb(240, 240, 240, 1)",
            buttonHoverIconColor: "rgb(30, 30, 30, 1)",
            modalColor: "#ffffff",
            color: "#383838",
        }
    }
    if (theme.global.current.dark) {
        return {
            backgroundColor: "rgba(11, 11, 11, 0.98)",
            modalBackgroundColor: "rgba(40, 40, 40, 1)",
            buttonHoverBgColor: "rgb(27, 27, 27, 1)",
            buttonHoverIconColor: "rgb(255, 255, 255, 1)",
            modalColor: "#ffffff",
            color: "#6f767d",
        }
    }
    throw new Error()
}
export const NavigationbarComponent = () => {
    const [theme, setTheme] = useTheme()
    return (
        <>
            <div className="navigationbar translucent">
                <div className="inner">
                    <div className="top-area">
                        <a className="button home">
                            <svg className="icon">
                                <use href="#icon-home"></use>
                            </svg>
                            <div className="modal-container">
                                <div className="menu">
                                    <p>ホーム</p>
                                </div>
                                <div className="triangle"></div>
                            </div>
                        </a>
                        <a className="button">
                            <svg className="icon">
                                <use href="#icon-chat"></use>
                            </svg>
                            <div className="modal-container">
                                <div className="menu">
                                    <p>スレッド</p>
                                </div>
                                <div className="triangle"></div>
                            </div>
                        </a>
                        <a className="button">
                            <svg className="icon at">
                                <use href="#icon-at"></use>
                            </svg>
                            <div className="modal-container">
                                <div className="menu">
                                    <p>通知</p>
                                </div>
                                <div className="triangle"></div>
                            </div>
                        </a>
                        <a className="button" href="/group/global">
                            <svg className="icon globe">
                                <use href="#icon-globe"></use>
                            </svg>
                            <div className="modal-container">
                                <div className="menu">
                                    <p>探す</p>
                                </div>
                                <div className="triangle"></div>
                            </div>
                        </a>
                        <a className="button" href="/settings/account">
                            <svg className="icon settings">
                                <use href="#icon-settings"></use>
                            </svg>
                            <div className="modal-container">
                                <div className="menu">
                                    <p>設定</p>
                                </div>
                                <div className="triangle"></div>
                            </div>
                        </a>
                    </div>
                    <div className="bottom-area">
                        <a
                            className="button appearance"
                            onClick={(e) => {
                                e.preventDefault()
                                setTheme(theme.global.current.light ? "dark" : "light")
                                return false
                            }}>
                            <svg className="icon">
                                <use href="#icon-computer"></use>
                            </svg>
                            <div className="modal-container">
                                <div className="menu">
                                    <p>外観</p>
                                </div>
                                <div className="triangle"></div>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
            <style jsx>{`
                .navigationbar {
                    color: ${getStyleForTheme(theme)["color"]};
                    background-color: ${getStyleForTheme(theme)["backgroundColor"]};
                }
                .modal-container {
                    background-color: ${getStyleForTheme(theme)["modalBackgroundColor"]};
                    color: ${getStyleForTheme(theme)["modalColor"]};
                }
                .triangle {
                    background-color: ${getStyleForTheme(theme)["modalBackgroundColor"]};
                }
                .button:hover {
                    background-color: ${getStyleForTheme(theme)["buttonHoverBgColor"]};
                }
                .button:hover svg {
                    stroke: ${getStyleForTheme(theme)["buttonHoverIconColor"]};
                    fill: ${getStyleForTheme(theme)["buttonHoverIconColor"]};
                }
            `}</style>
            <style jsx>{`
                .navigationbar {
                    transition-duration: 0.2s;
                    transition-property: background-color;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: column;
                    flex: 0 0 80px;
                    height: 100%;
                    border-radius: 12px 0 0 12px;
                    z-index: 4;
                    position: relative;
                }
                .navigationbar::-webkit-scrollbar {
                    width: 0px;
                }
                .navigationbar::-webkit-scrollbar-thumb {
                    border-radius: 10px;
                    background-color: gray;
                }
                .navigationbar::-webkit-scrollbar-track-piece {
                    background-clip: padding-box;
                    background-color: transparent;
                    border-color: transparent;
                }
                .inner {
                    transition-duration: 0.2s;
                    transition-property: background-color;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding-top: 8px;
                    width: 100%;
                    height: 100%;
                    padding: 24px 16px 8px 16px;
                    flex-direction: column;
                    border-radius: 12px 0 0 12px;
                }
                .top-area {
                    flex: 1 1 auto;
                }
                .bottom-area {
                    flex: 0 1 auto;
                }
                .button {
                    flex: 0 0 auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 12px;
                    box-sizing: border-box;
                    background-color: transparent;
                    transition: 0.05s;
                    cursor: pointer;
                    width: 40px;
                    height: 40px;
                    margin-bottom: 14px;
                    position: relative;
                }
                .button:hover .modal-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }
                .icon {
                    width: 20px;
                    height: 20px;
                    text-align: center;
                    flex-shrink: 0;
                    stroke-width: 0.5px;
                    stroke: #7d7d7d;
                    fill: #7d7d7d;
                }
                .icon.at {
                    stroke-width: 0;
                    width: 22px;
                    height: 22px;
                }
                .icon.search {
                    width: 19px;
                    height: 19px;
                }
                .icon.settings {
                    width: 22px;
                    height: 22px;
                    stroke-width: 0.25;
                }
                .modal-container {
                    display: none;
                    position: absolute;
                    top: 0;
                    left: 50px;
                    z-index: 100;
                    transition: opacity 0.1s;
                    visibility: visible;
                    border-radius: 8px;
                    box-sizing: border-box;
                    padding: 6px 12px;
                    height: 38px;
                    box-sizing: border-box;
                    word-break: keep-all;
                    box-shadow: ;
                    border-radius: 8px;
                    opacity: 1;
                }
                .modal-container.hidden {
                    z-index: 0;
                    opacity: 0;
                }
                p {
                    margin: 0;
                    padding: 0;
                    line-height: 1em;
                    font-size: 14px;
                }
                .triangle {
                    position: absolute;
                    width: 8px;
                    height: 8px;
                    transform: rotate(45deg);
                    top: calc(50% - 4px);
                    left: -4px;
                }
            `}</style>
        </>
    )
}
