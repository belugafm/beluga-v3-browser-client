import { useSidebarComponentState } from "../../state/component/sidebar"
import { Themes, useTheme } from "../theme"

const lerp = (a: number, b: number, ratio: number) => {
    return a * (1 - ratio) + b * ratio
}

const rlerp = (a: number, b: number, ratio: number) => {
    return (b - a * (1 - ratio)) / ratio
}

const getStyleForTheme = (theme: Themes) => {
    if (theme.global.current.light) {
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
    if (theme.global.current.dark) {
        return {
            backgroundColor: "rgba(29, 29, 29, 0.98)",
            color: "#6f767d",
        }
    }
    throw new Error()
}
export const NavigationbarComponent = () => {
    const [theme] = useTheme()
    return (
        <>
            <div className="navigationbar translucent"></div>
            <style jsx>{`
                .navigationbar {
                    background-color: ${getStyleForTheme(theme)["backgroundColor"]};
                    color: ${getStyleForTheme(theme)["color"]};
                }
            `}</style>
            <style jsx>{`
                .navigationbar {
                    transition-duration: 0.2s;
                    transition-property: background-color;
                    box-sizing: border-box;
                    padding: 24px 16px 0 16px;
                    display: flex;
                    flex-direction: column;
                    width: 70px;
                    height: 100%;
                    border-radius: 12px 0 0 12px;
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
            `}</style>
        </>
    )
}
