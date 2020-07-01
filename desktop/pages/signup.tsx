import Head from "next/head"
import { GetStaticProps } from "next"
import { ThemeProvider, defaultUserTheme } from "../components/theme"
import { App } from "../components/app"
import { AccountSessionComponent } from "../components/forms/account/session"

export default ({}) => {
    return (
        <div>
            <Head>
                <title>アカウント登録</title>
            </Head>
            <ThemeProvider
                userTheme={defaultUserTheme}
                defaultGlobalThemeName="light">
                <App>
                    <AccountSessionComponent active="signup" />
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
