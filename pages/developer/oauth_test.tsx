import Head from "next/head"
import { useState } from "react"
import { InputComponent } from "../../component/desktop/form/input"
import { ThemeProvider } from "../../component/theme"
import { OAuth } from "oauth"

export default () => {
    const [consumerKey, setConsumerKey] = useState("")
    const [consumerSecret, setConsumerSecret] = useState("")
    const [accessToken, setRequestToken] = useState("")
    const [accessTokenSecret, setRequestTokenSecret] = useState("")

    const postMessage = async () => {
        var oauth = new OAuth(
            "https://localhost.beluga.fm/api/v1/oauth/request_token",
            "https://localhost.beluga.fm/api/v1/oauth/access_token",
            consumerKey,
            consumerSecret,
            "1.0A",
            null,
            "HMAC-SHA1"
        )
        oauth.post(
            "https://localhost.beluga.fm/api/v1/message/post",
            accessToken,
            accessTokenSecret,
            {
                channel_id: 1,
                text: "aaa",
            },
            "application/x-www-form-urlencoded",
            (error, result, response) => {
                console.error(error)
            }
        )
    }
    return (
        <>
            <Head>
                <title>OAuth動作確認</title>
            </Head>
            <ThemeProvider userTheme={null} defaultGlobalThemeName={null}>
                <div>
                    <InputComponent
                        label="consumer_key"
                        type="text"
                        name="name"
                        value={consumerKey}
                        errorMessage={[]}
                        hint={[]}
                        onChange={(e) => setConsumerKey(e.target.value)}
                    />
                    <InputComponent
                        label="consumer_secret"
                        type="text"
                        name="name"
                        value={consumerSecret}
                        errorMessage={[]}
                        hint={[]}
                        onChange={(e) => setConsumerSecret(e.target.value)}
                    />
                    <InputComponent
                        label="access_token"
                        type="text"
                        name="name"
                        value={accessToken}
                        errorMessage={[]}
                        hint={[]}
                        onChange={(e) => setRequestToken(e.target.value)}
                    />
                    <InputComponent
                        label="access_token_secret"
                        type="text"
                        name="name"
                        value={accessTokenSecret}
                        errorMessage={[]}
                        hint={[]}
                        onChange={(e) => setRequestTokenSecret(e.target.value)}
                    />
                    <button onClick={(e) => postMessage()}>送信</button>
                </div>
            </ThemeProvider>
        </>
    )
}
