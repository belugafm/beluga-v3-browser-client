import { useTheme } from "./theme"
import { useLoggedInUser } from "../models/session"
import { GetServerSideProps } from "next"
import Cookie from "cookie"

export const App = ({ children }) => {
    const [theme] = useTheme()
    const { isLoading } = useLoggedInUser()
    if (isLoading) {
        return (
            <>
                <style jsx global>{`
                    html,
                    body {
                        background-color: ${theme.global.current
                            .backgroundPrimaryColor};
                        color: ${theme.global.current.fontPrimaryColor};
                        transition: background-color
                                ${theme.global.current.transitionDuration}
                                linear 0s,
                            color ${theme.global.current.transitionDuration}
                                linear 0s;
                    }
                `}</style>
            </>
        )
    }
    return (
        <>
            {children}
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
            `}</style>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const cookie = Cookie.parse(context.req.headers.cookie)
    const { theme } = cookie
    return {
        props: {
            theme: theme ? theme : null,
        },
    }
}
