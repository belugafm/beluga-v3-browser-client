import Head from "next/head"
import { ThemeProvider } from "../component/theme"

export default ({ theme }) => {
    return (
        <div>
            <Head>
                <title>ホーム</title>
            </Head>
            <ThemeProvider userTheme={null} defaultGlobalThemeName={theme}>
                <ul>
                    <li>
                        <a href="/channel/create">チャンネル作成</a>
                    </li>
                    <li>
                        <a href="/community/create">コミュニティ作成</a>
                    </li>
                </ul>
            </ThemeProvider>
        </div>
    )
}
