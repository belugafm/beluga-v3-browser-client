import Head from "next/head"
import { PostboxComponent } from "../../component/postbox"
import { ThemeProvider } from "../../component/theme"
import { App } from "../../component/app"
import { ChatComponent } from "../../component/chat"
export { getServerSideProps } from "../../component/app"

export default ({ theme, params }) => {
    return (
        <div>
            <Head>
                <title>チャンネル</title>
            </Head>
            <ThemeProvider userTheme={null} defaultGlobalThemeName={theme}>
                <App>
                    <ChatComponent context={{ channelId: params.channelId }} />
                </App>
            </ThemeProvider>
        </div>
    )
}
