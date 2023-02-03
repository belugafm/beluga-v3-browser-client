import * as WebAPI from "../../../api"

async function login_with_twitter() {
    const res = await WebAPI.auth.twitter.requestToken()
    if (res.ok) {
        location.href = `https://api.twitter.com/oauth/authenticate?oauth_token=${res.oauthToken}`
        return
    }
    alert("Error")
}

export const LoginWithTwitterButton = () => {
    return <button onClick={login_with_twitter}>Twitterでログインする</button>
}
