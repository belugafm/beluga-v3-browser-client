export { getServerSideProps } from "../../component/chat/next"

import * as api from "../../api"

import {
    ChannelDescriptionModalActionContext,
    ChannelDescriptionModalComponent,
    useChannelDescriptionModalState,
} from "../../component/page/landing/channel_modal"
import { TooltipActionContext, useTooltipState } from "../../state/component/tooltip"

import { AppPreviewComponent } from "../../component/page/landing/app_preview"
import Head from "next/head"
import { TooltipComponent } from "../../component/chat/tooltip"
import { swrFetchData } from "../../swr/index/page"
import { ServerSideProps } from "../../component/chat/next"

async function loginWithTwitter() {
    const res = await api.auth.twitter.requestToken()
    if (res.ok) {
        location.href = `https://api.twitter.com/oauth/authenticate?oauth_token=${res.oauthToken}`
        return
    }
    alert("Error")
}

export const Button = ({ onClick, children, className }) => {
    return (
        <>
            <button className={className} onClick={onClick}>
                {children}
            </button>
            <style jsx>{`
                .black {
                    background-color: rgba(0, 0, 0, 0.9);
                    color: white;
                }
                .white {
                    background-color: transparent;
                    color: rgb(0, 0, 0);
                }
                button {
                    font-weight: 700;
                    width: 220px;
                    font-size: 16px;
                    flex: 0 0 auto;
                    box-sizing: border-box;
                    margin: 10px;
                    padding: 0 20px;
                    cursor: pointer;
                    border: 1px solid rgb(0, 0, 0);
                    border-radius: 30px;
                    height: 50px;
                    backdrop-filter: blur(10px);
                    transition: 0.3s;
                }
                button:hover {
                    transform: translateY(-3px);
                }
            `}</style>
        </>
    )
}

export const LoginWithTwitterButton = () => {
    return (
        <Button className="login-with-twitter black" onClick={loginWithTwitter}>
            Twitterでログイン
        </Button>
    )
}

export default (props: ServerSideProps) => {
    const { isLoading, errors, channels, messages, channelGroup } = swrFetchData()
    const [tooltipState, tooltipAction] = useTooltipState()
    const [channelDetailModalState, channelDetailModalAction] = useChannelDescriptionModalState()
    if (isLoading) {
        return null
    }
    for (const error of errors) {
        if (error) {
            return <div>エラー</div>
        }
    }
    if (channels == null) {
        return <div>エラー</div>
    }
    if (messages == null) {
        return <div>エラー</div>
    }
    if (channelGroup == null) {
        return <div>エラー</div>
    }
    return (
        <>
            <Head>
                <title>Beluga</title>
            </Head>
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
                            <LoginWithTwitterButton />
                            <Button
                                className="signup white"
                                onClick={() => (location.href = "/signup_with_password")}>
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
                        <div className="inner">
                            <TooltipActionContext.Provider value={tooltipAction}>
                                <ChannelDescriptionModalActionContext.Provider
                                    value={channelDetailModalAction}>
                                    <AppPreviewComponent
                                        channelGroup={channelGroup}
                                        channels={channels}
                                        messages={messages}
                                    />
                                </ChannelDescriptionModalActionContext.Provider>
                            </TooltipActionContext.Provider>
                        </div>
                    </div>
                </div>
            </div>
            <TooltipComponent {...tooltipState} />
            <ChannelDescriptionModalComponent {...channelDetailModalState} />
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
                    font-weight: 700;
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
                    height: 100%;
                    max-height: 1000px;
                    border-radius: 12px;
                    padding: 40px 6px 6px 6px;
                    flex: 0 1 auto;
                    min-width: 0;
                    box-sizing: border-box;
                    background-color: rgba(255, 255, 255, 0.5);
                    background: linear-gradient(
                        135deg,
                        rgba(255, 255, 255, 0.5) 0%,
                        rgba(255, 255, 255, 0.25) 75%,
                        rgba(255, 255, 255, 0.5) 100%
                    );
                    backdrop-filter: blur(50px) saturate(180%);
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
                    width: 100%;
                    height: 100%;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: row;
                    border-radius: 10px;
                    overflow: hidden;
                }
            `}</style>
            <style global jsx>{`
                @import url("https://fonts.googleapis.com/css2?family=M+PLUS+1:wght@400;500;700&display=swap");
                button {
                    font-family: "M PLUS 1", sans-serif;
                }
                a {
                    text-decoration: none;
                }
                a:hover {
                    text-decoration: underline;
                }
                body {
                    font-family: "M PLUS 1", sans-serif;
                    background-image: url("/assets/images/bg_01_1920.png?1637570884");
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
                        background-image: url("/assets/images/bg_01_3840.png?1637570884");
                    }
                }
                #__next {
                    height: 100%;
                    width: 100%;
                    position: relative;
                }
            `}</style>
        </>
    )
}
