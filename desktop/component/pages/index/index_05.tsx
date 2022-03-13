import * as api from "../../../api"

async function loginWithTwitter() {
    const res = await api.auth.twitter.requestToken()
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
                    font-weight: bold;
                    width: 220px;
                    font-size: 16px;
                    flex: 0 0 auto;
                    box-sizing: border-box;
                    margin: 10px;
                    padding: 0 20px;
                    cursor: pointer;
                    background-color: transparent;
                    border: 1px solid rgb(0, 0, 0);
                    border-radius: 30px;
                    height: 50px;
                    color: rgb(0, 0, 0);
                    backdrop-filter: blur(10px);
                }
                hoge {
                    transition: background-color 0.05s ease-in 0s, color 0.1s ease-in 0s,
                        filter 0.05s ease-in 0s;
                }
                button:hover {
                    background-color: rgba(0, 0, 0, 0.9);
                    color: white;
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

export const Index05Component = () => {
    return (
        <>
            <div className="navigation-bar"></div>
            <div className="hero">
                <div className="description-area">
                    <div className="inner">
                        <div className="title"></div>
                        <div className="description">
                            <p>Belugaは文章や画像を投稿するチャット型SNSです。</p>
                            <p>リアルタイムなコミュニケーションを楽しむことができます。</p>
                        </div>
                        <div className="start-beluga">
                            <LoginWithTwitterButton themeColor="#0c31b3" />
                            <Button
                                className="signup"
                                onClick={() => (location.href = "/signup")}
                                themeColor="#0c31b3">
                                新規登録
                            </Button>
                        </div>
                        <div className="already-have-account">
                            すでにアカウントをお持ちの場合は<a href="/login">ログイン</a>
                            してください
                        </div>
                    </div>
                </div>
                <div className="app-area">
                    <div className="app-container">
                        <div className="window-buttons">
                            <span className="window-button-1"></span>
                            <span className="window-button-2"></span>
                            <span className="window-button-3"></span>
                        </div>
                        <div className="inner"></div>
                    </div>
                </div>
            </div>
            <style jsx>{`
                .navigation-bar {
                    height: 70px;
                    display: flex;
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                }
                .hero {
                    display: flex;
                    flex-direction: row;
                    position: absolute;
                    top: 70px;
                    left: 0;
                    right: 0;
                    bottom: 0;
                }
                .description-area {
                    width: 50%;
                    flex: 1 1 auto;
                }
                .description-area > .inner {
                    min-width: 600px;
                    width: 100%;
                }
                .title {
                    background-image: url("/assets/svg/logo_black.svg?1637570889");
                    background-repeat: no-repeat;
                    background-size: 400px auto;
                    background-position: top;
                    height: 100px;
                    margin: 0;
                    padding: 0;
                    margin-top: 150px;
                }
                .description {
                    margin-top: 50px;
                    color: rgb(30, 30, 30);
                    font-size: 18px;
                    text-align: center;
                }
                .description > p {
                    margin: 0;
                    padding: 0;
                }
                .start-beluga {
                    text-align: center;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    margin-top: 50px;
                }
                .already-have-account {
                    text-align: center;
                    flex-direction: row;
                    margin-top: 20px;
                    color: rgb(30, 30, 30);
                    font-size: 15px;
                }
                .already-have-account > a {
                    color: rgb(0, 0, 0);
                    text-decoration: underline;
                    font-weight: bold;
                }
                .app-area {
                    width: 50%;
                    flex: 1 1 auto;
                    padding: 50px 50px 50px 10px;
                    display: flex;
                    justify-content: flex-start;
                    box-sizing: border-box;
                }
                .app-container {
                    width: 800px;
                    height: 100%;
                    max-height: 1000px;
                    border-radius: 10px;
                    padding: 40px 6px 6px 6px;
                    flex: 0 1 auto;
                    box-sizing: border-box;
                    background-color: rgba(255, 255, 255, 0.5);
                    background: linear-gradient(
                        135deg,
                        rgba(255, 255, 255, 0.5) 0%,
                        rgba(255, 255, 255, 0.25) 75%,
                        rgba(255, 255, 255, 0) 100%
                    );
                    backdrop-filter: blur(50px);
                    filter: drop-shadow(4px 4px 50px rgba(0, 0, 0, 0.1));
                    position: relative;
                }
                .window-buttons {
                    position: absolute;
                    width: 80px;
                    height: 40px;
                    top: 0;
                    left: 0;
                    display: flex;
                    align-items: center;
                    padding-left: 16px;
                }
                .window-buttons > span {
                    display: inline-block;
                    width: 10px;
                    height: 10px;
                    border-radius: 10px;
                    margin-right: 8px;
                }
                .window-button-1 {
                    background-color: rgba(255, 255, 255, 1);
                }
                .window-button-2 {
                    background-color: rgba(255, 255, 255, 0.8);
                }
                .window-button-3 {
                    background-color: rgba(255, 255, 255, 0.6);
                }
                .app-container > .inner {
                    background-color: white;
                    border-radius: 6px;
                    width: 100%;
                    height: 100%;
                    box-sizing: border-box;
                }
            `}</style>
            <style global jsx>{`
                body {
                    background-image: url("/assets/images/bg_05_1920.png?1637570884");
                    background-position-y: -150px;
                    background-size: 100% auto;
                    background-repeat: no-repeat;
                    background-color: white;
                    height: 100vh;
                    width: 100vw;
                    margin: 0;
                    padding: 0;
                }
                @media screen and (min-width: 1920px) {
                    body {
                        background-image: url("/assets/images/bg_05_3840.png?1637570884");
                    }
                }
                #__next {
                    height: 100%;
                    width: 100%;
                    position: relative;
                }
                #__next > div {
                    height: 100%;
                    width: 100%;
                    position: relative;
                }
            `}</style>
        </>
    )
}
