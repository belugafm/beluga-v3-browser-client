import Head from "next/head"
import { GetStaticProps } from "next"
import { ThemeProvider, defaultUserTheme } from "../components/theme"
import { App } from "../components/app"
import { WelcomeComponent } from "../components/welcome"

export default ({}) => {
    return (
        <div>
            <Head>
                <title>Belugaへようこそ！</title>
            </Head>
            <ThemeProvider
                userTheme={defaultUserTheme}
                defaultGlobalThemeName="light">
                <App>
                    <WelcomeComponent />
                </App>
            </ThemeProvider>
        </div>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    return {
        props: {},
    }
}
