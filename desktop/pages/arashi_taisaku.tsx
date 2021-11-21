export { getServerSideProps } from "../component/app"

import { AccountSessionComponent } from "../component/forms/account/session"
import { App } from "../component/app"
import Head from "next/head"
import { ThemeProvider } from "../component/theme"

export default ({ theme }) => {
    return (
        <div>
            <Head>
                <title>荒らし対策について</title>
            </Head>
            <ThemeProvider userTheme={null} defaultGlobalThemeName={theme}>
                <App>
                    <div>
                        <p>荒らし対策について書く</p>
                    </div>
                </App>
            </ThemeProvider>
        </div>
    )
}
