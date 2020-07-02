import Head from "next/head"
export { getServerSideProps } from "../components/app"
import { ThemeProvider, defaultUserTheme } from "../components/theme"
import { App } from "../components/app"
import { AccountSessionComponent } from "../components/forms/account/session"

export default ({ theme }) => {
    return (
        <div>
            <Head>
                <title>ログイン</title>
            </Head>
            <ThemeProvider
                userTheme={defaultUserTheme}
                defaultGlobalThemeName={theme}>
                <App>
                    <AccountSessionComponent active="signin" />
                </App>
            </ThemeProvider>
        </div>
    )
}
