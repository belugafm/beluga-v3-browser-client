export { getServerSideProps } from "../component/app"

import { App } from "../component/app"
import Head from "next/head"
import { Index01Component } from "../component/pages/index/index_01"
import { Index02Component } from "../component/pages/index/index_02"
import { ThemeProvider } from "../component/theme"

export default ({ theme }) => {
    return (
        <div>
            <Head>
                <title>Beluga</title>
            </Head>
            <ThemeProvider userTheme={null} defaultGlobalThemeName={theme}>
                <App>
                    <Index01Component />
                </App>
            </ThemeProvider>
        </div>
    )
}
