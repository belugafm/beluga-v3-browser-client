import Head from "next/head"
import { ThemeProvider } from "../../component/theme"
import { WelcomeComponent } from "../../component/desktop/welcome"

export default ({ theme }) => {
    return (
        <div>
            <Head>
                <title>Belugaへようこそ！</title>
            </Head>
            <ThemeProvider userTheme={null} defaultGlobalThemeName={theme}>
                <WelcomeComponent />
            </ThemeProvider>
        </div>
    )
}
