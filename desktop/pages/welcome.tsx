export { getServerSideProps } from "../component/app"
import Head from "next/head"
import { ThemeProvider } from "../component/theme"
import { App } from "../component/app"
import { WelcomeComponent } from "../component/welcome"

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
