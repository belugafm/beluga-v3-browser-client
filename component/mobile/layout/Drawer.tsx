import { useContext } from "react"
import { DrawerStateContext } from "../../../state/component/drawer"
import { ThemeT, useTheme } from "../../theme"

const getStyle = (theme: ThemeT) => {
    if (theme.global.current.light) {
        return {
            color: "#000000",
        }
    }
    if (theme.global.current.dark) {
        return {
            color: "#ffffff",
        }
    }
    throw new Error()
}
export const DrawerComponent = ({ children }) => {
    const [theme, setTheme] = useTheme()
    const state = useContext(DrawerStateContext)
    return (
        <>
            <div className="drawer">
                <div className="sidebar-area"></div>
                <div className="content-area"> {children}</div>
            </div>
            <style jsx>{`
                .drawer {
                    position: fixed;
                    top: 50px;
                    left: ${state.left};
                    height: calc(100dvh - 50px);
                    width: 90dvw;
                    background: none;
                    z-index: 3;
                }
                .content-area {
                    overflow-x: hidden;
                    overflow-y: scroll;
                    height: 100%;
                }
            `}</style>
        </>
    )
}
