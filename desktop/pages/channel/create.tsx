export { getServerSideProps } from "../../component/app"
import Head from "next/head"
import { ThemeProvider } from "../../component/theme"
import { App } from "../../component/app"
import { CreateChannelFormComponent } from "../../component/forms/channel/create"

export default ({ theme }) => {
    return (
        <div>
            <Head>
                <title>チャンネルの作成</title>
            </Head>
            <ThemeProvider userTheme={null} defaultGlobalThemeName={theme}>
                <App>
                    <CreateChannelFormComponent />
                </App>
            </ThemeProvider>
        </div>
    )
}
