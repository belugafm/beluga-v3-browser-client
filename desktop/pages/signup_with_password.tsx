export { getServerSideProps } from "../component/app"

import Head from "next/head"
import { SignupFormComponent } from "../component/pages/signup/signup_with_password"

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
                    background-image: url("/assets/svg/friends.svg");
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

export default () => {
    return (
        <>
            <Head>
                <title>アカウント作成</title>
            </Head>
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
                        <div className="sep"></div>
                        <div className="section title">
                            <h1>アカウント作成</h1>
                        </div>
                        <div className="section start-beluga">
                            <SignupFormComponent />
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
                    margin-top: 100px;
                }
                .session-inside {
                    position: relative;
                    z-index: 0;
                }
                .session-bg {
                    transform: rotate(-4deg);
                    position: absolute;
                    top: 60px;
                    left: -60px;
                    right: -60px;
                    bottom: 60px;
                    border-radius: 20px;
                    background-color: rgba(255, 255, 255, 0.5);
                    background: linear-gradient(
                        -135deg,
                        rgba(255, 255, 255, 0.2) 0%,
                        rgba(255, 255, 255, 0.7) 75%,
                        rgba(255, 255, 255, 0.2) 100%
                    );
                    backdrop-filter: blur(50px);
                    filter: drop-shadow(4px 4px 30px rgba(0, 0, 0, 0.1));
                }
                .session-main {
                    border-radius: 10px;
                    overflow: hidden;
                    position: relative;
                    filter: drop-shadow(4px 4px 30px rgba(0, 0, 0, 0.1));
                }
                .section {
                    box-sizing: border-box;
                    padding: 40px;
                    background-color: white;
                }
                .sep {
                    height: 1px;
                    background-color: rgba(255, 255, 255, 0.8);
                }
                .section.title {
                    padding: 0;
                    padding-top: 40px;
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
                }
                .section.invite-link {
                    display: flex;
                    flex-direction: row;
                }
                .section.start-beluga {
                    padding-top: 20px;
                }
                .already-have-account {
                    text-align: center;
                    margin-top: 20px;
                }
                .login-link {
                    color: black;
                    text-decoration: none;
                    font-weight: normal;
                }
                .login-link:hover {
                    color: black;
                    text-decoration: underline;
                }
            `}</style>
            <style global jsx>{`
                @import url("https://fonts.googleapis.com/css2?family=M+PLUS+1:wght@400;700&display=swap");
                a {
                    color: #1547c5;
                }
                a:hover {
                    text-decoration: underline;
                }
                body {
                    font-family: "M PLUS 1", sans-serif;
                    background-image: url("/assets/images/bg_02_1920.png?1637570884");
                    background-size: 1920px auto;
                    background-repeat: no-repeat;
                    background-position-x: center;
                    margin: 0;
                    padding: 0;
                }
                @media screen and (min-width: 1920px) {
                    body {
                        background-image: url("/assets/images/bg_02_3840.png?1637570884");
                    }
                }
                #__next {
                    width: 100%;
                    height: 100%;
                    justify-content: center;
                    align-items: center;
                    margin: 0 auto;
                }
            `}</style>
        </>
    )
}
