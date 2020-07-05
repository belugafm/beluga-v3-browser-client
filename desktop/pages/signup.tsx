export { getServerSideProps } from "../component/app"
import Head from "next/head"
import { ThemeProvider } from "../component/theme"
import { App } from "../component/app"
import { AccountSessionComponent } from "../component/forms/account/session"
import { ThemeSettingComponent } from "../component/sidebar/settings/theme"

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
