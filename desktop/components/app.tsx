import { useTheme } from "./theme"
import { useLoggedInUser } from "../models/session"

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
                }
            `}</style>
        </>
    )
}
