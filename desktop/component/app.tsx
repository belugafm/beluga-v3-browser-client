import Cookie from "cookie"
import { GetServerSideProps } from "next"
import { swrGetLoggedInUser } from "../swr/session"
import { useTheme } from "./theme"

export const App = ({ children }) => {
    const [theme] = useTheme()
    const { isLoading } = swrGetLoggedInUser()
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
