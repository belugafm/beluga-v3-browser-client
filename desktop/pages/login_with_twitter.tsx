import * as WebAPI from "../api"

import { App } from "../component/app"
import Head from "next/head"
import { ThemeProvider } from "../component/theme"
import { isString } from "../lib/type_check"
import { useRouter } from "next/router"
import useSWR from "swr"

export const useOAuthCallback = () => {
    const router = useRouter()
    const { oauth_token, oauth_verifier } = router.query
    if (isString(oauth_token) !== true) {
        return <p>Error</p>
    }
    if (isString(oauth_verifier) !== true) {
        return <p>Error</p>
    }
    const { data, error, mutate } = useSWR("access_token", () => {
        return WebAPI.auth.twitter.authenticate({
            // @ts-ignore
            oauth_token,
            // @ts-ignore
            oauth_verifier,
        })
    })
    if (error) {
        return <p>Error</p>
    }
    if (data) {
        mutate(data, false)
        location.href = "/welcome"
        return <p>OK</p>
    }
    return <p>Loading</p>
}

const CallbackComponent = () => {
    return useOAuthCallback()
}

export default ({ theme }) => {
    return (
        <div>
            <Head>
                <title>Twitterでログイン</title>
            </Head>
            <ThemeProvider userTheme={null} defaultGlobalThemeName={theme}>
                <App>
                    <CallbackComponent />
                </App>
            </ThemeProvider>
        </div>
    )
}
