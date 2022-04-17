import Cookie from "cookie"
import { GetServerSideProps } from "next"
import { swrShowLoggedInUser } from "../swr/session"
import { useTheme } from "./theme"

export const App = ({ children }) => {
    const [theme] = useTheme()
    const { isLoading } = swrShowLoggedInUser()
    return (
        <>
            {isLoading ? null : children}
            <style jsx global>{`
                body {
                    font-family: Arial, sans-serif;
                }
            `}</style>
            <style jsx global>{``}</style>
        </>
    )
}
