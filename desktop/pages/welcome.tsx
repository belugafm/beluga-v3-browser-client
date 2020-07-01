import Head from "next/head"
import { GetServerSideProps } from "next"
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

export const getServerSideProps: GetServerSideProps = async () => {
    return {
        props: {},
    }
}
