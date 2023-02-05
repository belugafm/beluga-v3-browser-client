export { getServerSideProps } from "../../component/next"

import Head from "next/head"
import { ServerSideProps } from "../../component/next"
import { SignupFormComponent } from "../../component/desktop/page/signup_with_password"
import { ThemeProvider } from "../../component/theme"

const RiskyUserSection = () => {
    return (
        <>
            <div className="ghost"></div>
            <div className="about-risky-user">
                荒らし対策のため「Twitterでログイン」以外の登録を一時的に停止しています。詳細は
                <a href="/arashi_taisaku">荒らし対策について</a>
                をお読みください。
            </div>
            <style jsx>{`
                .ghost {
                    background-image: url("/assets/svg/ghost.svg?7");
                    background-repeat: no-repeat;
                    background-size: 80px;
                    background-position: center;
                    width: 80px;
                    flex: 0 0 auto;
                }
                .about-risky-user {
                    margin-left: 20px;
                    flex: 1 1 auto;
                    font-size: 15px;
                }
            `}</style>
        </>
    )
}

const InviteLinkSection = () => {
    return (
        <>
            <div className="friends"></div>
            <div className="about-risky-user">
                あなたの友だちがすでにBelugaを利用している場合、
                <a href="/what-is-invite-link">招待リンク</a>
                を発行してもらうことができます。招待リンクから登録すると機能制限を受けません。
            </div>
            <style jsx>{`
                .friends {
                    background-image: url("/assets/svg/friends.svg?3");
                    background-repeat: no-repeat;
                    background-size: 80px;
                    background-position: center;
                    width: 80px;
                    flex: 0 0 auto;
                }
                .about-risky-user {
                    margin-left: 20px;
                    flex: 1 1 auto;
                    font-size: 15px;
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
            <ThemeProvider userTheme={null} defaultGlobalThemeName={null}>
                <div className="session-container">
                    <div className="session-inside">
                        <div className="session-bg"></div>
                        <div className="session-main">
                            <div className="section risky-user">
                                <RiskyUserSection />
                            </div>
                            <div className="sep"></div>
                            <div className="section invite-link">
                                <InviteLinkSection />
                            </div>
                        </div>
                    </div>
                    <div className="already-have-account">
                        <a href="/login" className="login-link">
                            すでにアカウントをお持ちですか？
                        </a>
                    </div>
                </div>
                <style jsx>{`
                    .session-container {
                        width: 500px;
                        font-size: 16px;
                        line-height: 24px;
                        margin: 0 auto;
                        margin-top: 70px;
                        color: white;
                    }
                    .session-inside {
                        position: relative;
                        z-index: 0;
                    }
                    .session-bg {
                        display: none;
                        transform: rotate(-4deg);
                        position: absolute;
                        top: 60px;
                        left: -60px;
                        right: -60px;
                        bottom: 60px;
                        border-radius: 20px;
                        background-color: rgba(19, 19, 19, 0.5);
                        background: linear-gradient(
                            -135deg,
                            rgba(19, 19, 19, 0.95) 0%,
                            rgba(19, 19, 19, 0.95) 75%,
                            rgba(19, 19, 19, 0.95) 100%
                        );
                        backdrop-filter: blur(50px) saturate(180%);
                        filter: drop-shadow(4px 4px 30px rgba(0, 0, 0, 0.1));
                    }
                    .session-main {
                        border-radius: 10px;
                        overflow: hidden;
                        position: relative;
                        filter: drop-shadow(4px 4px 30px rgba(0, 0, 0, 0.1));
                        backdrop-filter: blur(50px) saturate(180%);
                    }
                    .section {
                        box-sizing: border-box;
                        padding: 40px;
                        background-color: rgba(22, 22, 22, 0.96);
                    }
                    .sep {
                        height: 1px;
                        background-color: rgba(4, 4, 4, 0.8);
                    }
                    .section.title {
                        padding: 0;
                        padding-top: 30px;
                    }
                    h1 {
                        font-size: 20px;
                        text-align: center;
                        margin: 0;
                        padding: 0;
                    }
                    .section.risky-user {
                        display: flex;
                        flex-direction: row;
                        padding: 30px 40px;
                    }
                    .section.invite-link {
                        display: flex;
                        flex-direction: row;
                        padding: 30px 40px;
                        background-color: rgba(18, 18, 18, 0.96);
                    }
                    .section.start-beluga {
                        padding: 20px 40px;
                    }
                    .already-have-account {
                        text-align: center;
                        margin-top: 20px;
                    }
                    .login-link {
                        font-weight: bold;
                        color: white;
                        text-decoration: none;
                    }
                    .login-link:hover {
                        text-decoration: underline;
                    }
                `}</style>
                <style global jsx>{`
                    @import url("https://fonts.googleapis.com/css2?family=M+PLUS+1:wght@400;700&display=swap");
                    a {
                        color: #64b5f6;
                        text-decoration: none;
                    }
                    a:hover {
                        text-decoration: underline;
                    }
                    body {
                        font-family: "M PLUS 1", sans-serif;
                        background-image: url("/assets/images/bg_07_1920.jpg?1637570884");
                        background-size: 100% auto;
                        margin: 0;
                        padding: 0;
                    }
                    @media screen and (min-width: 1920px) {
                        body {
                            background-image: url("/assets/images/bg_07_3840.jpg?1637570884");
                        }
                    }
                    input,
                    button {
                        outline: none;
                    }
                    #__next {
                        width: 100%;
                        height: 100%;
                        justify-content: center;
                        align-items: center;
                        margin: 0 auto;
                    }
                `}</style>
            </ThemeProvider>
        </>
    )
}
