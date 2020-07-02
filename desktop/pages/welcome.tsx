import Head from "next/head"
export { getServerSideProps } from "../components/app"
import { ThemeProvider } from "../components/theme"
import { App } from "../components/app"
import { WelcomeComponent } from "../components/welcome"

export default ({ theme }) => {
    return (
        <div>
            <Head>
                <title>Belugaへようこそ！</title>
            </Head>
            <ThemeProvider userTheme={null} defaultGlobalThemeName={theme}>
                <App>
                    <WelcomeComponent />
                </App>
            </ThemeProvider>
        </div>
    )
}
