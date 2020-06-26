import Head from "next/head"
import { GetStaticProps } from "next"
import { SignupFormComponent } from "../components/signup"
import { ThemeProvider, defaultUserTheme } from "../components/theme"
import { App } from "../components/app"

export default ({}) => {
    return (
        <div>
            <Head>
                <title>アカウント登録</title>
            </Head>
            <ThemeProvider
                userTheme={defaultUserTheme}
                defaultGlobalThemeName="dark"
            >
                <App>
                    <SignupFormComponent />
                </App>
            </ThemeProvider>
        </div>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    return {
        props: {},
    }
}
