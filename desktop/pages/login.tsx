export { getServerSideProps } from "../components/app"
import Head from "next/head"
import { ThemeProvider } from "../components/theme"
import { App } from "../components/app"
import { AccountSessionComponent } from "../components/forms/account/session"

export default ({ theme }) => {
    return (
        <div>
            <Head>
                <title>ログイン</title>
            </Head>
            <ThemeProvider userTheme={null} defaultGlobalThemeName={theme}>
                <App>
                    <AccountSessionComponent active="signin" />
                </App>
            </ThemeProvider>
        </div>
    )
}
