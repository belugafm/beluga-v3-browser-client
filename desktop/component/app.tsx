import Cookie from "cookie"
import { GetServerSideProps } from "next"
import { useLoggedInUser } from "../state/session"
import { useTheme } from "./theme"

export const App = ({ children }) => {
    const [theme] = useTheme()
    const { isLoading } = useLoggedInUser()
    return (
        <>
            {isLoading ? null : children}
            <style jsx global>{`
                body {
                    font-family: Arial, sans-serif;
                }
            `}</style>
            <style jsx global>{`
                html,
                body {
                    background-color: ${theme.global.current.backgroundPrimaryColor};
                    color: ${theme.global.current.fontPrimaryColor};
                    transition: background-color ${theme.global.current.transitionDuration} linear
                            0s,
                        color ${theme.global.current.transitionDuration} linear 0s;
                }
                a {
                    color: ${theme.user.linkPrimaryColor};
                    text-decoration: none;
                    font-weight: bold;
                    transition: color ${theme.global.current.transitionDuration} linear 0s;
                }
            `}</style>
        </>
    )
}
