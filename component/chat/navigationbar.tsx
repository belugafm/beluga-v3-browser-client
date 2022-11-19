import { Themes, useTheme } from "../theme"

const getStyleForTheme = (theme: Themes) => {
    if (theme.global.current.light) {
        return {
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            innerBackgroundColor: "rgba(42, 42, 42, 0.6)",
            color: "#383838",
        }
    }
    if (theme.global.current.dark) {
        return {
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            innerBackgroundColor: "rgba(42, 42, 42, 0.5)",
            color: "#6f767d",
        }
    }
    throw new Error()
}
export const NavigationbarComponent = () => {
    const [theme] = useTheme()
    return (
        <>
            <div className="navigationbar translucent">
                <div className="inner">
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
                    <a className="button">
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
            </div>
            <style jsx>{`
                .navigationbar {
                    color: ${getStyleForTheme(theme)["color"]};
                    background-color: ${getStyleForTheme(theme)["backgroundColor"]};
                }
                .inner {
                    background-color: ${getStyleForTheme(theme)["innerBackgroundColor"]};
                }
            `}</style>
            <style jsx>{`
                .navigationbar {
                    transition-duration: 0.2s;
                    transition-property: background-color;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: column;
                    width: 70px;
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
                    padding: 24px 16px 0 16px;
                    flex-direction: column;
                    border-radius: 12px 0 0 12px;
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
                    margin-bottom: 4px;
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
                .button:hover {
                    background-color: rgb(17, 17, 17);
                }
                .button:hover svg {
                    stroke: white;
                    fill: white;
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
                    padding: 6px 10px;
                    height: 38px;
                    box-sizing: border-box;
                    word-break: keep-all;
                    background-color: rgba(42, 42, 42, 1);
                    box-shadow: ;
                    border-radius: 8px;
                    opacity: 1;
                    color: white;
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
                    background-color: rgba(42, 42, 42, 1);
                    transform: rotate(45deg);
                    top: calc(50% - 4px);
                    left: -4px;
                }
            `}</style>
        </>
    )
}
