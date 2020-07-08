import Head from "next/head"
import { PostboxComponent } from "../../component/postbox"
import { ThemeProvider } from "../../component/theme"
import { App } from "../../component/app"
import { ThemeSettingComponent } from "../../component/sidebar/settings/theme"
export { getServerSideProps } from "../../component/app"

export default ({ theme, params }) => {
    return (
        <div>
            <Head>
                <title>チャンネル</title>
            </Head>
            <ThemeProvider userTheme={null} defaultGlobalThemeName={theme}>
                <App>
                    <p>{params.channel_id}</p>
                    <PostboxComponent channelId={params.channel_id} />
                    <ThemeSettingComponent />
                </App>
            </ThemeProvider>
        </div>
    )
}
