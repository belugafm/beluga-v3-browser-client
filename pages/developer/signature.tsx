import Head from "next/head"
import { useState } from "react"
import { InputComponent } from "../../component/desktop/form/input"
import { ThemeProvider } from "../../component/desktop/theme"
import OAuth from "oauth-1.0a"
import crypto from "crypto"

export default () => {
    const [consumerKey, setConsumerKey] = useState("")
    const [consumerSecret, setConsumerSecret] = useState("")
    const [timestamp, setTimestamp] = useState("")
    const [nonce, setNonce] = useState("")
    const [signature, setSignature] = useState("")

    const getSignature = () => {
        const oauth = new OAuth({
            consumer: { key: consumerKey, secret: consumerSecret },
            signature_method: "HMAC-SHA1",
            hash_function(base_string, key) {
                return crypto.createHmac("sha1", key).update(base_string).digest("base64")
            },
        })
        var oauth_data = {
            oauth_consumer_key: consumerKey,
            oauth_nonce: nonce,
            oauth_signature_method: "HMAC-SHA1",
            oauth_timestamp: parseInt(timestamp),
            oauth_version: "1.0",
        }

        const signature = oauth.getSignature(
            {
                url: "https://beluga.fm/api/v1/oauth/request_token",
                method: "POST",
                data: {},
            },
            undefined,
            oauth_data
        )
        setSignature(signature)
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
                        label="timestamp"
                        type="text"
                        name="name"
                        value={timestamp}
                        errorMessage={[]}
                        hint={[]}
                        onChange={(e) => setTimestamp(e.target.value)}
                    />
                    <InputComponent
                        label="nonce"
                        type="text"
                        name="name"
                        value={nonce}
                        errorMessage={[]}
                        hint={[]}
                        onChange={(e) => setNonce(e.target.value)}
                    />
                    <button onClick={(e) => getSignature()}>計算</button>
                    <p>{signature}</p>
                </div>
            </ThemeProvider>
        </>
    )
}
