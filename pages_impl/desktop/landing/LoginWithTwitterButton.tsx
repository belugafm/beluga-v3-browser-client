import { requestToken } from "../../../api/methods/auth/twitter"
import { Button } from "./Button"

async function loginWithTwitter() {
    const res = await requestToken()
    if (res.ok) {
        location.href = `https://api.twitter.com/oauth/authenticate?oauth_token=${res.oauthToken}`
        return
    }
    alert("Error")
}

export const LoginWithTwitterButton = () => {
    return (
        <Button className="login-with-twitter black" onClick={loginWithTwitter}>
            Twitterでログイン
        </Button>
    )
}
