import Head from "next/head"
import { GetStaticProps } from "next"
import { ThemeProvider, defaultUserTheme } from "../components/theme"
import { App } from "../components/app"
import { AccountSessionComponent } from "../components/forms/account/session"

export default ({}) => {
    return (
        <div>
            <Head>
                <title>ログイン</title>
            </Head>
            <ThemeProvider
                userTheme={defaultUserTheme}
                defaultGlobalThemeName="dark">
                <App>
                    <AccountSessionComponent active="login" />
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
