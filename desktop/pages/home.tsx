export { getServerSideProps } from "../component/app"
import Head from "next/head"
import { ThemeProvider } from "../component/theme"
import { App } from "../component/app"
import { AccountSessionComponent } from "../component/forms/account/session"

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
