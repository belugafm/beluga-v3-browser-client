import Cookie from "cookie"
import { GetServerSideProps } from "next"
import Head from "next/head"
import { SigninFormComponent } from "./SigninForm"
import { ThemeProvider } from "../../../component/Theme"
import { LoginWithTwitterComponent } from "./LoginWithTwitter"

export default ({ userName }) => {
    return (
        <>
            <Head>
                <title>ログイン</title>
            </Head>
            <ThemeProvider userTheme={null} defaultGlobalThemeName={null}>
                <div className="session-container">
                    <div className="session-inside">
                        <div className="session-bg"></div>
                        <div className="session-main">
                            <div className="section login-with-twitter">
                                <LoginWithTwitterComponent />
                            </div>
                            <div className="sep"></div>
                            <div className="section title">
                                <h1>ログイン</h1>
                            </div>
                            <div className="section signin">
                                <SigninFormComponent userNamePlaceholder={userName} />
                            </div>
                        </div>
                    </div>
                </div>
                <style jsx>{`
                    .session-container {
                        width: 450px;
                        font-size: 16px;
                        line-height: 24px;
                        margin: 0 auto;
                        margin-top: 70px;
                        margin-top: calc(min(200px, (100vh - 500px) / 2));
                        color: white;
                    }
                    .session-inside {
                        position: relative;
                        z-index: 0;
                    }
                    .session-bg {
                        display: none;
                        transform: rotate(-2deg);
                        position: absolute;
                        top: 40px;
                        left: 30px;
                        right: -30px;
                        bottom: -40px;
                        border-radius: 10px;
                        background-color: rgba(255, 255, 255, 0.5);
                        background: linear-gradient(
                            -135deg,
                            rgba(255, 255, 255, 0.5) 0%,
                            rgba(255, 255, 255, 0.4) 50%,
                            rgba(255, 255, 255, 0.3) 100%
                        );
                        backdrop-filter: blur(50px);
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
                        padding: 30px 40px;
                        background-color: rgba(22, 22, 22, 0.9);
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
                    .section.login-with-twitter {
                        display: flex;
                        flex-direction: row;
                    }
                    .section.invite-link {
                        display: flex;
                        flex-direction: row;
                    }
                    .section.signin {
                        padding: 20px 40px;
                        overflow: hidden;
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

export const getServerSideProps: GetServerSideProps = async (context) => {
    const cookie = Cookie.parse(context.req.headers.cookie || "")
    const { user_name } = cookie
    const { params } = context
    return {
        props: {
            userName: user_name ? user_name : null,
            params: params ? params : {},
        },
    }
}
