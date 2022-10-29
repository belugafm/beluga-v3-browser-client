import { GetServerSideProps } from "next"
import { useState } from "react"
import * as api from "../../api"
import { Response } from "../../api"

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { query } = context
    const { consumer_key, consumer_secret, request_token, request_token_secret } = query
    return {
        props: {
            consumer_key,
            consumer_secret,
            request_token,
            request_token_secret,
        },
    }
}

export default ({ consumer_key, consumer_secret, request_token, request_token_secret }) => {
    const [authorized, setAuthorized] = useState(false)
    const [callbackUrl, setCallbackUrl] = useState("")

    const authorize = async () => {
        const response = await api.oauth.authorize({
            consumer_key,
            consumer_secret,
            request_token,
            request_token_secret,
        })
        if (response.ok) {
            const { verifier } = response
            alert(verifier)
            const response2 = await api.oauth.accessToken({
                consumer_key,
                consumer_secret,
                request_token,
                request_token_secret,
                verifier,
            })
            if (response2.ok) {
                const { app } = response2
                const url = `${app.callback_url}?consumer_key=${consumer_key}&consumer_secret=${consumer_secret}&request_token=${request_token}&request_token_secret=${request_token_secret}`
                alert(url)
                setCallbackUrl(url)
                setAuthorized(true)
            }
        }
    }
    const backToAppLink = authorized ? <a href={callbackUrl}>アプリへ戻る</a> : null
    return (
        <div>
            <p>{consumer_key}</p>
            <p>{consumer_secret}</p>
            <p>{request_token}</p>
            <p>{request_token_secret}</p>
            <button onClick={(e) => authorize()}>許可する</button>
            {backToAppLink}
        </div>
    )
}
