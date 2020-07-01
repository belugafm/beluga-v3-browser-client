import Head from "next/head"
import { GetServerSideProps } from "next"
import { ThemeProvider, defaultUserTheme } from "../components/theme"
import { App } from "../components/app"
import { AccountSessionComponent } from "../components/forms/account/session"
import Cookie from "cookie"
import { ThemeSettingComponent } from "../components/sidebar/settings/theme"

export default ({ theme }) => {
    return (
        <div>
            <Head>
                <title>アカウント登録</title>
            </Head>
            <ThemeProvider
                userTheme={defaultUserTheme}
                defaultGlobalThemeName={theme}>
                <App>
                    <AccountSessionComponent active="signup" />
                    <ThemeSettingComponent />
                </App>
            </ThemeProvider>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const cookie = Cookie.parse(context.req.headers.cookie)
    const { theme } = cookie
    return {
        props: {
            theme: theme ? theme : null,
        },
    }
}
