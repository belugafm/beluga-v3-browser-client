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
    return (
        <>
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
                    flex: 0 0 auto;
                    padding: 16px;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: column;
                }
                .inner {
                    flex: 1 1 auto;
                    display: flex;
                    flex-direction: column;
                }
            `}</style>
        </>
    )
}
