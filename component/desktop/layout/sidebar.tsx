import { SidebarStateContext, useSidebarComponentState } from "../../../state/component/sidebar"
import { ThemeT, useTheme } from "../../theme"

export const getStyle = (theme: ThemeT) => {
    if (theme.global.current.light) {
        return {
            backgroundColor: "rgba(247,247,247,0.95)",
            color: "#6f767d",
        }
    }
    if (theme.global.current.dark) {
        return {
            backgroundColor: "rgba(16,16,16,0.96)",
            color: "#6f767d",
        }
    }
    throw new Error()
}
export const SidebarComponent = ({ children }) => {
    const [theme] = useTheme()
    const state = useSidebarComponentState()
    return (
        <>
            <SidebarStateContext.Provider value={state}>
                <div className="sidebar translucent">
                    <div className="inner">{children}</div>
                </div>
                <style jsx>{`
                    .sidebar {
                        background-color: ${getStyle(theme)["backgroundColor"]};
                        color: ${getStyle(theme)["color"]};
                    }
                `}</style>
                <style jsx>{`
                    .sidebar {
                        height: 100%;
                        flex: 0 0 300px;
                        transition-duration: 0.2s;
                        transition-property: background-color;
                        padding: 16px 12px 0 16px;
                        box-sizing: border-box;
                        box-sizing: border-box;
                        display: flex;
                        flex-direction: column;
                        -webkit-overflow-scrolling: touch;
                        overflow-x: hidden;
                        overflow-y: scroll;
                        z-index: 3;
                    }
                    .sidebar::-webkit-scrollbar {
                        width: 0px;
                    }
                    .sidebar::-webkit-scrollbar-thumb {
                        border-radius: 10px;
                        background-color: gray;
                    }
                    .sidebar::-webkit-scrollbar-track-piece {
                        background-clip: padding-box;
                        background-color: transparent;
                        border-color: transparent;
                    }
                    .inner {
                        width: 272px; /* prevent grid from expanding */
                        flex: 1 1 auto;
                        display: flex;
                        flex-direction: column;
                    }
                `}</style>
            </SidebarStateContext.Provider>
        </>
    )
}
