import Head from "next/head"
import { ThemeProvider } from "../../../component/Theme"
import { CallbackComponent } from "./Callback"

export default ({ theme }) => {
    return (
        <div>
            <Head>
                <title>Twitterでログイン</title>
            </Head>
            <ThemeProvider userTheme={null} defaultGlobalThemeName={theme}>
                <CallbackComponent />
            </ThemeProvider>
        </div>
    )
}
