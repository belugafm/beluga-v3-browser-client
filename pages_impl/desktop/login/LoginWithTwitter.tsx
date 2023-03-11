import { requestToken } from "../../../api/methods/auth/twitter"

async function loginWithTwitter() {
    const res = await requestToken()
    if (res.ok) {
        location.href = `https://api.twitter.com/oauth/authenticate?oauth_token=${res.oauthToken}`
        return
    }
    alert("Error")
}

export const LoginWithTwitterComponent = () => {
    return (
        <>
            <div className="launch"></div>
            <div className="login-with-twitter">
                Twitterでログインしたことがある場合はパスワードが存在しないので引き続き
                <a href="#" onClick={() => loginWithTwitter()}>
                    Twitterでログイン
                </a>
                してください。
            </div>
            <style jsx>{`
                .launch {
                    background-image: url("/assets/svg/launch.svg?4");
                    background-repeat: no-repeat;
                    background-size: 80px;
                    background-position: top;
                    width: 80px;
                    flex: 0 0 auto;
                }
                .login-with-twitter {
                    min-height: 80px;
                    margin-left: 20px;
                    flex: 1 1 auto;
                    font-size: 15px;
                }
            `}</style>
        </>
    )
}
