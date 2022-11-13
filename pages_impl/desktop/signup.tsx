import * as WebAPI from "../../api"

import { App } from "../../component/app"
import Head from "next/head"
import { ThemeProvider } from "../../component/theme"
import { ServerSideProps } from "../../component/chat/next"

async function loginWithTwitter() {
    const res = await WebAPI.auth.twitter.requestToken()
    if (res.ok) {
        location.href = `https://api.twitter.com/oauth/authenticate?oauth_token=${res.oauthToken}`
        return
    }
    alert("Error")
}

const Button = ({ onClick, children, className }) => {
    return (
        <>
            <button className={className} onClick={onClick}>
                {children}
            </button>
            <style jsx>{`
                button {
                    width: 100%;
                    font-size: 16px;
                    font-weight: bold;
                    flex: 0 0 auto;
                    box-sizing: border-box;
                    margin: 0;
                    margin-bottom: 10px;
                    padding: 0 20px;
                    cursor: pointer;
                    background: #1651ce;
                    border: none;
                    border-radius: 6px;
                    height: 44px;
                    color: white;
                    transition: background-color 0.1s ease-in 0s;
                }
                button:last-child {
                    margin: 0;
                }
                button.twitter {
                    background-color: #1da1f2;
                    background-color: hsl(203, 89%, 53%);
                }
                button.signup-without-twitter {
                    background-color: #657786;
                    background-color: hsl(207, 14%, 46%);
                }
                button.twitter:hover {
                    background-color: hsl(203, 89%, 48%);
                }
                button.signup-without-twitter:hover {
                    background-color: hsl(207, 14%, 41%);
                }
            `}</style>
        </>
    )
}

const RiskyUserSection = () => {
    return (
        <>
            <div className="ghost"></div>
            <div className="about-risky-user">
                荒らし対策のため「Twitterでログイン」していないユーザーの機能を制限しています。詳細は
                <a href="/arashi_taisaku">荒らし対策について</a>
                をお読みください。
            </div>
            <style jsx>{`
                .ghost {
                    background-image: url("/assets/svg/ghost.svg");
                    background-repeat: no-repeat;
                    background-size: 80px;
                    background-position: center;
                    width: 80px;
                    flex: 0 0 auto;
                }
                .about-risky-user {
                    margin-left: 20px;
                    flex: 1 1 auto;
                }
            `}</style>
        </>
    )
}

const StartBelugaSection = () => {
    return (
        <>
            <h1>アカウント作成</h1>
            <p>Twitterアカウントでログインすれば2クリックで完了します。</p>
            <Button className="twitter" onClick={() => loginWithTwitter()}>
                Twitterでログイン
            </Button>
            <Button
                className="signup-without-twitter"
                onClick={() => {
                    location.href = "/signup_with_password"
                }}>
                Twitterアカウントを持っていない
            </Button>
            <style jsx>{`
                h1 {
                    color: #222222;
                    font-size: 24px;
                    margin: 0;
                    padding: 0;
                    text-align: center;
                    margin: 10px 0 30px 0;
                }
                p {
                    margin: 0;
                    padding: 0;
                    margin-bottom: 20px;
                }
            `}</style>
        </>
    )
}

export default (props: ServerSideProps) => {
    return (
        <>
            <Head>
                <title>アカウント作成</title>
            </Head>
            <div className="session-container">
                <div className="section">
                    <div className="border-white section-risky-user">
                        <RiskyUserSection />
                    </div>
                </div>
                <div className="section">
                    <div className="border-white section-start-beluga">
                        <StartBelugaSection />
                    </div>
                </div>
                <div className="section section-already-have-account">
                    <a href="/login" className="login-link">
                        すでにアカウントをお持ちですか？
                    </a>
                </div>
            </div>
            <style jsx>{`
                .session-container {
                    width: 500px;
                    flex: 0 0 auto;
                    font-size: 16px;
                    line-height: 24px;
                }
                .section {
                    margin-bottom: 30px;
                }
                .border-white {
                    background-color: white;
                    border-radius: 8px;
                    box-sizing: border-box;
                    padding: 30px;
                    filter: drop-shadow(4px 4px 50px rgba(0, 0, 0, 0.1));
                }
                .section-risky-user {
                    display: flex;
                    flex-direction: row;
                }
                .section-already-have-account {
                    text-align: center;
                }
                .login-link {
                    color: rgba(255, 255, 255, 0.8);
                    font-weight: normal;
                }
                .login-link:hover {
                    color: white;
                }
            `}</style>
            <style global jsx>{`
                a {
                    color: #1547c5;
                }
                a:hover {
                    text-decoration: underline;
                }
                body {
                    font-family: "Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN",
                        "Hiragino Sans", Meiryo, sans-serif;
                    background-image: url("/assets/images/bg_06_1920.jpg?1637570884");
                    background-size: 1920px auto;
                    background-position-x: center;
                    background-repeat: no-repeat;
                    height: 100vh;
                    width: 100vw;
                    margin: 0;
                    padding: 0;
                }
                @media screen and (min-width: 1920px) {
                    body {
                        background-image: url("/assets/images/bg_06_3840.jpg?1637570884");
                    }
                }
                #__next {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    justify-content: center;
                    align-items: center;
                    margin: 0 auto;
                    display: flex;
                    flex-direction: column;
                    background-color: transparent;
                }
            `}</style>
        </>
    )
}
