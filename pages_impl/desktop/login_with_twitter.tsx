import * as WebAPI from "../../api"

import Head from "next/head"
import { ThemeProvider } from "../../component/theme"
import { isString } from "../../lib/type_check"
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
        if (data.ok) {
            location.href = "/welcome"
            return (
                <p>
                    ログインしました。すぐにページが移動しない場合は、
                    <a href="/welcom">こちらのリンク</a>をクリックしてください。
                </p>
            )
        } else {
            return (
                <>
                    {data.description.map((desc) => {
                        console.log(desc)
                        return <p>{desc}</p>
                    })}
                </>
            )
        }
    }
    return <p>ログインしています…</p>
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
                <CallbackComponent />
            </ThemeProvider>
        </div>
    )
}
