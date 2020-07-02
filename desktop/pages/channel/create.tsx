export { getServerSideProps } from "../../components/app"
import Head from "next/head"
import { ThemeProvider } from "../../components/theme"
import { App } from "../../components/app"
import { AccountSessionComponent } from "../../components/forms/account/session"

export default ({ theme }) => {
    return (
        <div>
            <Head>
                <title>チャンネルの作成</title>
            </Head>
            <ThemeProvider userTheme={null} defaultGlobalThemeName={theme}>
                <App></App>
            </ThemeProvider>
        </div>
    )
}
