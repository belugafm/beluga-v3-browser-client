export { getServerSideProps } from "../components/app"
import Head from "next/head"
import { ThemeProvider } from "../components/theme"
import { App } from "../components/app"
import { AccountSessionComponent } from "../components/forms/account/session"

export default ({ theme }) => {
    return (
        <div>
            <Head>
                <title>ホーム</title>
            </Head>
            <ThemeProvider userTheme={null} defaultGlobalThemeName={theme}>
                <App>
                    <ul>
                        <li>
                            <a href="/channel/create">チャンネル作成</a>
                        </li>
                        <li>
                            <a href="/community/create">コミュニティ作成</a>
                        </li>
                    </ul>
                </App>
            </ThemeProvider>
        </div>
    )
}
