export { getServerSideProps } from "../component/app"

import { AccountSessionComponent } from "../component/forms/account/session"
import { App } from "../component/app"
import Head from "next/head"
import { ThemeProvider } from "../component/theme"

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
