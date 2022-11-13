import { useSidebarComponentState } from "../../state/component/sidebar"
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
    if (theme.global.current.dark) {
        return {
            // backgroundColor: "#  ",
            backgroundColor: "#191919",
            color: "#6f767d",
        }
    }
    if (theme.global.current.dark || theme.global.current.darkWithBgImage) {
        const alpha = 0.98
        return {
            // backgroundColor: "#  ",
            backgroundColor: `rgba(${rlerp(8, 21, alpha)}, ${rlerp(8, 20, alpha)}, ${rlerp(
                11,
                25,
                alpha
            )}, ${alpha})`,
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
                    width: 80px;
                    height: 100%;
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
