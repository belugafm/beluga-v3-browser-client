import Head from "next/head"
import { useState } from "react"
import { InputComponent } from "../../component/form/input"
import { ThemeProvider } from "../../component/theme"
import * as api from "../../api"

export default () => {
    const [consumerKey, setConsumerKey] = useState("")
    const [consumerSecret, setConsumerSecret] = useState("")
    const [requestToken, setRequestToken] = useState("")
    const [requestTokenSecret, setRequestTokenSecret] = useState("")
    const [verifier, setVerifier] = useState("")

    const postMessage = async () => {
        const response = await api.oauth.accessToken(
            {
                request_token: requestToken,
                verifier: verifier,
            },
            {
                consumer_key: consumerKey,
                consumer_secret: consumerSecret,
                access_token: requestToken,
                access_token_secret: requestTokenSecret,
            }
        )
        if (response.ok) {
            setRequestToken(response.requestToken)
            setRequestTokenSecret(response.requestTokenSecret)
        }
    }
    return (
        <>
            <Head>
                <title>アクセストークンの取得</title>
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
                        label="request_token"
                        type="text"
                        name="name"
                        value={requestToken}
                        errorMessage={[]}
                        hint={[]}
                        onChange={(e) => setRequestToken(e.target.value)}
                    />
                    <InputComponent
                        label="request_token_secret"
                        type="text"
                        name="name"
                        value={requestTokenSecret}
                        errorMessage={[]}
                        hint={[]}
                        onChange={(e) => setRequestTokenSecret(e.target.value)}
                    />
                    <InputComponent
                        label="verifier"
                        type="text"
                        name="name"
                        value={verifier}
                        errorMessage={[]}
                        hint={[]}
                        onChange={(e) => setVerifier(e.target.value)}
                    />
                    <button onClick={(e) => postMessage()}>送信</button>
                </div>
            </ThemeProvider>
        </>
    )
}
