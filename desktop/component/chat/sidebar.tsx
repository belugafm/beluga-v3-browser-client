import { SidebarStateContext, useSidebarComponentState } from "../../state/component/sidebar"
import { Themes, useTheme } from "../theme"

const lerp = (a: number, b: number, ratio: number) => {
    return a * (1 - ratio) + b * ratio
}

const rlerp = (a: number, b: number, ratio: number) => {
    return (b - a * (1 - ratio)) / ratio
}

const getStyleForTheme = (theme: Themes) => {
    if (theme.global.current.light || theme.global.current.lightWithBgImage) {
        const alpha = 0.96
        return {
            // backgroundColor: "#fff",
            backgroundColor: `rgba(${lerp(244, 255, alpha)}, ${lerp(244, 255, alpha)}, ${lerp(
                244,
                255,
                alpha
            )}, ${alpha})`,
            color: "#383838",
        }
    }
    if (theme.global.current.dark || theme.global.current.darkWithBgImage) {
        const alpha = 0.98
        return {
            // backgroundColor: "#  ",
            backgroundColor: `rgba(${rlerp(17, 26, alpha)}, ${rlerp(19, 28, alpha)}, ${rlerp(
                21,
                31,
                alpha
            )}, ${alpha})`,
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
                        height: 100%;
                    }
                `}</style>
                <style jsx>{`
                    .sidebar {
                        transition-duration: 0.2s;
                        transition-property: background-color;
                        width: 300px;
                        box-sizing: border-box;
                        padding: 24px 16px 0 16px;
                        position: fixed;
                        top: 0;
                        left: 0;
                        bottom: 0;
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
