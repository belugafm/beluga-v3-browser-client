import Head from "next/head"
import { ThemeProvider } from "../../../component/Theme"
import { WelcomeComponent } from "./Welcome"

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
