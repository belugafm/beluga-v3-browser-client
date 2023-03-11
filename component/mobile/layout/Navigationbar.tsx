import { ThemeT, useTheme } from "../../Theme"

const getStyle = (theme: ThemeT) => {
    if (theme.global.current.light) {
        return {
            backgroundColor: "rgba(255,255,255,0.9)",
            color: "#000000",
        }
    }
    if (theme.global.current.dark) {
        return {
            backgroundColor: "rgba(16,16,16,0.96)",
            color: "#ffffff",
        }
    }
    throw new Error()
}
export const NavigationbarComponent = ({ children }) => {
    const [theme, setTheme] = useTheme()
    return (
        <>
            <div className="navigationbar translucent">
                <div className="inner">{children}</div>
            </div>
            <style jsx>{`
                .navigationbar {
                    color: ${getStyle(theme)["color"]};
                    background-color: ${getStyle(theme)["backgroundColor"]};
                    transition-duration: 0.2s;
                    transition-property: background-color;
                    box-sizing: border-box;
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 2;
                }
                .inner {
                    height: 50px;
                }
            `}</style>
        </>
    )
}
