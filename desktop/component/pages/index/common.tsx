import * as WebAPI from "../../../api"

async function loginWithTwitter() {
    const res = await WebAPI.auth.twitter.requestToken()
    if (res.ok) {
        location.href = `https://api.twitter.com/oauth/authenticate?oauth_token=${res.oauthToken}`
        return
    }
    alert("Error")
}

export const Button = ({ onClick, children, className, themeColor }) => {
    return (
        <>
            <button className={className} onClick={onClick}>
                {children}
            </button>
            <style jsx>{`
                button {
                    width: 220px;
                    font-size: 18px;
                    font-weight: bold;
                    flex: 0 0 auto;
                    box-sizing: border-box;
                    margin: 10px;
                    padding: 0 20px;
                    cursor: pointer;
                    background-color: transparent;
                    border: 2px solid white;
                    border-radius: 30px;
                    height: 60px;
                    color: white;
                    transition: background-color 0.1s ease-in 0s, color 0.1s ease-in 0s;
                }
                button:hover {
                    background-color: white;
                    color: ${themeColor};
                }
            `}</style>
        </>
    )
}

export const LoginWithTwitterButton = ({ themeColor }) => {
    return (
        <Button className="login-with-twitter" onClick={loginWithTwitter} themeColor={themeColor}>
            Twitterでログイン
        </Button>
    )
}
