import { Themes, useTheme } from "../theme"

import Cookie from "cookie"
import { GetServerSideProps } from "next"
import { swrGetLoggedInUser } from "../../swr/session"

const LoadingComponent = () => {
    const [theme] = useTheme()
    return getStyleForTheme(theme)
}

const getStyleForTheme = (theme: Themes) => {
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
            <div id="app"> {children}</div>
            <style jsx>{`
                #app {
                    background-size: 100% auto;
                    height: 100vh;
                    width: 100vw;
                    box-sizing: border-box;
                    position: relative;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    padding: 10px 0;
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
