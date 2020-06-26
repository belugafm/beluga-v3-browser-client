import { useTheme } from "./theme"

export const App = ({ children }) => {
    const [theme] = useTheme()
    return (
        <>
            {children}
            <style jsx global>{`
                body {
                    background-color: ${theme.global.current
                        .backgroundPrimaryColor};
                }
            `}</style>
        </>
    )
}
