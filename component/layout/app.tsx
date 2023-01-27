import { ThemeT, useTheme } from "../theme"

import Cookie from "cookie"
import { GetServerSideProps } from "next"
import { swrGetLoggedInUser } from "../../swr/session"

const LoadingComponent = () => {
    const [theme] = useTheme()
    return getStyleForTheme(theme)
}

const getStyleForTheme = (theme: ThemeT) => {
    if (theme.global.current.light) {
        return (
            <style jsx global>{`
                body {
                    color: #1a1a1a;
                    background: rgb(240, 240, 240);
                    background-size: 100% auto;
                    transition-duration: 0.2s;
                    transition-property: background-color;
                    background-repeat: repeat-y;
                }
            `}</style>
        )
    }
    if (theme.global.current.dark) {
        return (
            <style jsx global>{`
                body {
                    color: #fafafa;
                    background: rgb(50, 50, 50);
                    transition-duration: 0.2s;
                    transition-property: background-color;
                    background-size: 100% auto;
                    background-repeat: repeat-y;
                }
            `}</style>
        )
    }
}

const getFontStyle = () => {
    return (
        <style jsx global>{`
            @import url("https://fonts.googleapis.com/css2?family=M+PLUS+1:wght@300;400;500;700&display=swap");
            body,
            button {
                font-family: "M PLUS 1", sans-serif;
                font-weight: 400;
                padding: 0;
                margin: 0;
            }
        `}</style>
    )
    return (
        <style jsx global>{`
            @import url("https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&display=swap");
            body,
            button {
                font-family: "Noto Sans JP", sans-serif;
                font-weight: 400;
                padding: 0;
                margin: 0;
            }
        `}</style>
    )
}

const getScrollbarStyle = (theme: ThemeT) => {
    if (theme.global.current.light) {
        return {
            thumbColor: "rgba(140,140,140,0.96)",
        }
    }
    if (theme.global.current.dark) {
        return {
            thumbColor: "rgba(16,16,16,0.96)",
        }
    }
    throw new Error()
}

export const AppComponent = ({ children }: { children: any }) => {
    const [theme] = useTheme()
    const { isLoading, loggedInUser } = swrGetLoggedInUser()
    if (isLoading) {
        return <LoadingComponent />
    }
    if (loggedInUser == null) {
        return (
            <div>
                <a href="/login">ログイン</a>してください
            </div>
        )
    }
    return (
        <>
            <div id="app">
                <div className="container">{children}</div>
            </div>
            <style jsx>{`
                #app {
                    background-size: 100% auto;
                    height: 100vh;
                    width: 100vw;
                    box-sizing: border-box;
                    position: relative;
                    padding: 10px 0 10px 0;
                    display: flex;
                    flex-direction: row;
                    overflow-x: scroll;
                    overflow-y: hidden;
                }
                #app::-webkit-scrollbar {
                    height: 6px;
                }
                #app::-webkit-scrollbar-thumb {
                    border-radius: 10px;
                    background-color: transparent;
                    transition: 0.5s;
                }
                #app::-webkit-scrollbar-track-piece {
                    background-clip: padding-box;
                    background-color: transparent;
                    border-color: transparent;
                }
                .container {
                    flex: 0 0 auto;
                    min-width: 1080px;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    margin: 0 auto;
                }
            `}</style>
            <style jsx>{`
                #app:hover::-webkit-scrollbar-thumb {
                    background-color: ${getScrollbarStyle(theme)["thumbColor"]};
                }
            `}</style>
            <style jsx global>{`
                body {
                    font-weight: 400;
                    padding: 0;
                    margin: 0;
                }
                .translucent {
                    backdrop-filter: blur(30px) saturate(180%);
                }
            `}</style>
            {getFontStyle()}
            {getStyleForTheme(theme)}
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const cookie = Cookie.parse(context.req.headers.cookie || "")
    const { theme } = cookie
    const { params } = context
    return {
        props: {
            theme: theme ? theme : null,
            params: params ? params : {},
        },
    }
}
