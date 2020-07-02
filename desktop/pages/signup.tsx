import Head from "next/head"
import { ThemeProvider } from "../components/theme"
import { App } from "../components/app"
export { getServerSideProps } from "../components/app"
import { AccountSessionComponent } from "../components/forms/account/session"
import { ThemeSettingComponent } from "../components/sidebar/settings/theme"

export default ({ theme }) => {
    return (
        <div>
            <Head>
                <title>アカウント登録</title>
            </Head>
            <ThemeProvider userTheme={null} defaultGlobalThemeName={theme}>
                <App>
                    <AccountSessionComponent active="signup" />
                    <ThemeSettingComponent />
                </App>
            </ThemeProvider>
        </div>
    )
}
