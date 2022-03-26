import { SidebarStateContext, useSidebarComponentState } from "../../state/component/sidebar"
import { Themes, useTheme } from "../theme"

const getStyleForTheme = (theme: Themes) => {
    if (theme.global.current.light) {
        return {
            backgroundColor: "#fff",
            color: "#383838",
        }
    }
    if (theme.global.current.dark) {
        return {
            backgroundColor: "#1a1c1f",
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
                <div className="sidebar">{children}</div>
                <style jsx>{`
                    .sidebar {
                        background-color: ${getStyleForTheme(theme)["backgroundColor"]};
                        color: ${getStyleForTheme(theme)["color"]};
                        height: 100%;
                    }
                `}</style>
                <style jsx>{`
                    .sidebar {
                        transition-duration: 0.2s;
                        transition-property: background-color;
                        width: 300px;
                        box-sizing: border-box;
                        padding: 24px;
                        position: fixed;
                        top: 0;
                        left: 0;
                        bottom: 0;
                        display: flex;
                        flex-direction: column;
                        overflow: auto;
                        -webkit-overflow-scrolling: touch;
                    }
                `}</style>
            </SidebarStateContext.Provider>
        </>
    )
}
