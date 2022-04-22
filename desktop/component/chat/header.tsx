import { HeaderStateContext, useHeaderComponentState } from "../../state/component/header"
import { Themes, useTheme } from "../theme"

import { swrShowLoggedInUser } from "../../swr/session"

const getStyleForTheme = (theme: Themes) => {
    if (theme.global.current.light) {
        return {
            backgroundColor: "#fff",
            color: "#383838",
            boxShadow: "inset 1px 0px 0px #f3f3f3, inset 0 -1px 0px #eee",
        }
    }
    if (theme.global.current.dark) {
        return {
            backgroundColor: "#1a1c1f",
            color: "#6f767d",
            boxShadow: "inset 1px 0px 0px #111, inset 0 -1px 0px #111",
        }
    }
    throw new Error()
}

const displayName = (user) => {
    if (user == null) {
        return null
    }
    return <div>{user.name}</div>
}

export const HeaderComponent = () => {
    const [theme] = useTheme()
    const state = useHeaderComponentState()
    const { loggedInUser } = swrShowLoggedInUser()
    return (
        <>
            <HeaderStateContext.Provider value={state}>
                <div className="header">検索</div>
                <style jsx>{`
                    .header {
                        background-color: ${getStyleForTheme(theme)["backgroundColor"]};
                        color: ${getStyleForTheme(theme)["color"]};
                        box-shadow: ${getStyleForTheme(theme)["boxShadow"]};
                    }
                `}</style>
                <style jsx>{`
                    .header {
                        transition-duration: 0.2s;
                        position: fixed;
                        top: 0;
                        left: 300px;
                        right: 0;
                        z-index: 20;
                        display: flex;
                        align-items: center;
                        padding: 24px 40px;
                        box-sizing: border-box;
                        height: 80px;
                        z-index: 2;
                    }
                `}</style>
            </HeaderStateContext.Provider>
        </>
    )
}
