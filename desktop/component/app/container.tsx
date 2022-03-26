import { Themes, useTheme } from "../theme"

import Cookie from "cookie"
import { GetServerSideProps } from "next"
import { swrShowLoggedInUser } from "../../swr/session"

const LoadingComponent = () => {
    return <></>
}

const getStyleForTheme = (theme: Themes) => {
    if (theme.global.current.light) {
        return (
            <style jsx global>{`
                body {
                    transition-duration: 0.3s;
                    transition-property: background-color;
                    background-color: #f4f4f4;
                    color: #1a1a1a;
                }
            `}</style>
        )
    }
    if (theme.global.current.dark) {
        return (
            <style jsx global>{`
                body {
                    transition-duration: 0.3s;
                    transition-property: background-color;
                    background-color: #111315;
                    color: #fafafa;
                }
            `}</style>
        )
    }
}

const getFontStyle = () => {
    if (true) {
        return (
            <style jsx global>{`
                @import url("https://fonts.googleapis.com/css2?family=M+PLUS+1:wght@300;400;500;700&display=swap");
                body {
                    font-family: "M PLUS 1", sans-serif;
                    font-weight: 400;
                    padding: 0;
                    margin: 0;
                }
            `}</style>
        )
    }
    return (
        <style jsx global>{`
            @import url("https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&display=swap");
            body {
                font-family: "Noto Sans JP", sans-serif;
                font-weight: 400;
                padding: 0;
                margin: 0;
            }
        `}</style>
    )
}

export const ContainerComponent = ({ children }) => {
    const [theme] = useTheme()
    const { isLoading, loggedInUser } = swrShowLoggedInUser()
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
            <div className="app">{children}</div>
            <style jsx>{`
                .app {
                    background-size: 100% auto;
                    height: 100vh;
                    width: 100vw;
                    padding: 80px 0 0 300px;
                    box-sizing: border-box;
                }
            `}</style>
            <style jsx global>{`
                body {
                    font-weight: 400;
                    padding: 0;
                    margin: 0;
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
