export { getServerSideProps } from "../../components/app"
import Head from "next/head"
import { ThemeProvider } from "../../components/theme"
import { App } from "../../components/app"
import { CreateChannelFormComponent } from "../../components/forms/channel/create"

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
