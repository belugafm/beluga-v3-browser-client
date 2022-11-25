import { SidebarStateContext, useSidebarComponentState } from "../../state/component/sidebar"
import { Themes, useTheme } from "../theme"

export const getStyleForTheme = (theme: Themes) => {
    if (theme.global.current.light) {
        return {
            backgroundColor: "rgb(250,250,250)",
            color: "#6f767d",
        }
    }
    if (theme.global.current.dark) {
        return {
            backgroundColor: "rgba(16,16,16,0.98)",
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
                <div className="sidebar translucent">{children}</div>
                <style jsx>{`
                    .sidebar {
                        background-color: ${getStyleForTheme(theme)["backgroundColor"]};
                        color: ${getStyleForTheme(theme)["color"]};
                    }
                `}</style>
                <style jsx>{`
                    .sidebar {
                        height: 100%;
                        transition-duration: 0.2s;
                        transition-property: background-color;
                        width: 300px;
                        padding: 16px 8px 0 16px;
                        box-sizing: border-box;
                        box-sizing: border-box;
                        display: flex;
                        flex-direction: column;
                        -webkit-overflow-scrolling: touch;
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
                `}</style>
            </SidebarStateContext.Provider>
        </>
    )
}
