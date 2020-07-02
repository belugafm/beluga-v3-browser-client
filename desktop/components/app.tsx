import { useTheme } from "./theme"
import { useLoggedInUser } from "../models/session"
import { GetServerSideProps } from "next"
import Cookie from "cookie"

export const App = ({ children }) => {
    const [theme] = useTheme()
    const { isLoading } = useLoggedInUser()
    return (
        <>
            {isLoading ? null : children}
            <style jsx global>{`
                body {
                    font-family: "Helvetica Neue", Arial,
                        "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo,
                        sans-serif;
                }
            `}</style>
            <style jsx global>{`
                html,
                body {
                    background-color: ${theme.global.current
                        .backgroundPrimaryColor};
                    color: ${theme.global.current.fontPrimaryColor};
                    transition: background-color
                            ${theme.global.current.transitionDuration} linear 0s,
                        color ${theme.global.current.transitionDuration} linear
                            0s;
                }
                a {
                    color: ${theme.user.linkPrimaryColor};
                    text-decoration: none;
                    font-weight: bold;
                    transition: color ${theme.global.current.transitionDuration}
                        linear 0s;
                }
            `}</style>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const cookie = Cookie.parse(context.req.headers.cookie || "")
    const { theme } = cookie
    return {
        props: {
            theme: theme ? theme : null,
        },
    }
}
