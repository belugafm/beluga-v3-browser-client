import Head from "next/head"
import { useState } from "react"
import * as api from "../../api"
import { InputComponent } from "../../component/desktop/form/input"
import { ThemeProvider } from "../../component/theme"

export default ({}) => {
    const [consumerKey, setConsumerKey] = useState("")
    const [consumerSecret, setConsumerSecret] = useState("")
    const [requestToken, setRequestToken] = useState("")
    const [requestTokenSecret, setRequestTokenSecret] = useState("")

    const generateRequestToken = async () => {
        const response = await api.oauth.requestToken({
            consumer_key: consumerKey,
            consumer_secret: consumerSecret,
        })
        if (response.ok) {
            setRequestToken(response.requestToken)
            setRequestTokenSecret(response.requestTokenSecret)
        }
    }
    return (
        <>
            <Head>
                <title>リクエストトークンの取得</title>
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
                    <button onClick={(e) => generateRequestToken()}>送信</button>
                </div>
                <div>
                    <p>{requestToken}</p>
                    <p>{requestTokenSecret}</p>
                    <a
                        href={`https://localhost.beluga.fm/oauth/authorize?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}&request_token=${requestToken}&request_token_secret=${requestTokenSecret}`}>
                        開く
                    </a>
                </div>
            </ThemeProvider>
        </>
    )
}
