export { getServerSideProps } from "../../component/desktop/chat/next"

import * as api from "../../api"

import {
    ChannelDescriptionModalActionContext,
    ChannelDescriptionModalComponent,
    useChannelDescriptionModalState,
} from "../../component/desktop/page/landing/channel_modal"
import { TooltipActionContext, useTooltipState } from "../../state/component/tooltip"

import { AppPreviewComponent } from "../../component/desktop/page/landing/app_preview"
import Head from "next/head"
import { TooltipComponent } from "../../component/desktop/chat/tooltip"
import { swrFetchData } from "../../swr/index/page"
import { ServerSideProps } from "../../component/desktop/chat/next"

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
                    background-color: rgba(255, 255, 255, 0.9);
                    color: #0a051e;
                }
                .white {
                    background-color: transparent;
                    background-color: rgba(10, 5, 30, 0.8);
                    color: white;
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
                    border: 1px solid white;
                    border-radius: 30px;
                    height: 50px;
                    backdrop-filter: blur(30px) saturate(120%);
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
    const { isLoading, errors, messages, channels, channelGroup } = swrFetchData()
    const [tooltipState, tooltipAction] = useTooltipState()
    const [channelDetailModalState, channelDetailModalAction] = useChannelDescriptionModalState()
    if (isLoading) {
        return null
    }
    for (const error of errors) {
        if (error) {
            return <div>{error}</div>
        }
    }
    if (channels == null) {
        return <div>チャンネル一覧の読み込みに失敗しました</div>
    }
    if (messages == null) {
        return <div>タイムラインの読み込みに失敗しました</div>
    }
    if (channelGroup == null) {
        return <div>チャンネルグループの読み込みに失敗しました</div>
    }
    return (
        <>
            <Head>
                <title>Beluga</title>
            </Head>
            <svg>
                <symbol
                    xmlns="http://www.w3.org/2000/svg"
                    id="logo"
                    version="1.1"
                    x="0px"
                    y="0px"
                    viewBox="0 0 400 100">
                    <g>
                        <path
                            d="M19.03,84.73c-2.25,0-3.24-0.99-3.24-3.24V23.17c0-2.25,0.99-3.24,3.24-3.24h28.71
		c11.79,0,17.28,4.32,17.28,13.77v4.32c0,5.04-1.71,8.19-5.31,9.72c7.74,0.72,11.34,5.13,11.34,13.95v8.28
		c0,10.08-5.49,14.76-17.46,14.76H19.03z M36.04,44.95h7.65c2.34,0,3.42-1.17,3.42-3.6v-2.52c0-2.43-1.08-3.6-3.42-3.6h-7.65V44.95z
		 M36.04,69.43h11.7c2.34,0,3.42-1.17,3.42-3.6v-3.51c0-2.43-1.08-3.51-3.42-3.51h-11.7V69.43z"
                        />
                        <path
                            d="M84.28,84.73c-2.25,0-3.24-0.99-3.24-3.24V23.17c0-2.25,0.99-3.24,3.24-3.24h41.76c2.25,0,3.24,0.99,3.24,3.24
		V33.7c0,2.25-0.99,3.24-3.24,3.24H101.2v6.93h17.55c2.25,0,3.24,0.99,3.24,3.24v9.63c0,2.25-0.99,3.24-3.24,3.24H101.2v7.74h24.84
		c2.25,0,3.24,0.99,3.24,3.24v10.53c0,2.25-0.99,3.24-3.24,3.24H84.28z"
                        />
                        <path
                            d="M143.14,84.73c-2.25,0-3.24-0.99-3.24-3.24V23.17c0-2.25,0.99-3.24,3.24-3.24h13.95
		c2.25,0,3.24,0.99,3.24,3.24v44.55h12.33V53.14c0-2.25,0.99-3.24,3.24-3.24h13.05c2.25,0,3.24,0.99,3.24,3.24v28.35
		c0,2.25-0.99,3.24-3.24,3.24H143.14z"
                        />
                        <path
                            d="M229.81,86.08c-22.32,0-27.81-7.38-27.81-18.36V23.17c0-2.25,0.99-3.24,3.24-3.24h14.13
		c2.25,0,3.24,0.99,3.24,3.24v41.04c0,2.43,1.08,4.23,7.38,4.23c6.39,0,7.47-1.8,7.47-4.23V23.17c0-2.25,0.9-3.24,3.24-3.24h13.68
		c2.25,0,3.24,0.99,3.24,3.24v44.55C257.62,78.7,252.13,86.08,229.81,86.08z"
                        />
                        <path
                            d="M290.74,84.73c-15.12,0-22.14-5.85-22.14-18.36V38.29c0-12.51,7.02-18.36,22.14-18.36h22.5
		c2.25,0,3.24,0.99,3.24,3.24v10.89c0,2.25-0.99,3.24-3.24,3.24h-18.72c-3.78,0-5.49,1.44-5.49,4.5v21.51
		c0,3.06,1.35,4.41,4.14,4.41h8.73V53.68c0-2.25,0.99-3.24,3.24-3.24h13.95c2.25,0,3.24,0.99,3.24,3.24v27.81
		c0,2.25-0.99,3.24-3.24,3.24H290.74z"
                        />
                        <path
                            d="M348.43,84.73H335.2c-2.25,0-3.24-0.99-3.24-3.24V57.73c0-3.6,1.08-8.1,3.51-14.4l7.83-20.43
		c0.72-2.07,2.16-2.97,4.59-2.97h24.21c2.34,0,3.78,0.9,4.5,2.97l7.83,20.43c2.43,6.3,3.51,10.8,3.51,14.4v23.76
		c0,2.25-0.99,3.24-3.24,3.24H371.1c-2.43,0-3.51-0.99-3.51-3.24v-12.6h-15.93v12.6C351.67,83.74,350.68,84.73,348.43,84.73z
		 M352.57,52.51h14.13l-4.23-13.68c-0.45-1.08-0.99-1.53-1.71-1.53h-2.25c-0.72,0-1.26,0.45-1.71,1.53L352.57,52.51z"
                        />
                    </g>
                </symbol>
            </svg>
            <div className="navigationbar">
                <div className="navigationbar-link-wrapper">
                    <a className="navigationbar-link" href="">
                        開発者向け
                    </a>
                    <a className="navigationbar-link" href="">
                        このサイトについて
                    </a>
                    <a className="navigationbar-link svg" href="https://github.com/belugafm">
                        <svg className="github-icon">
                            <use href="#icon-github"></use>
                        </svg>
                    </a>
                </div>
            </div>
            <div className="hero">
                <div className="description-area">
                    <div className="inner">
                        <div className="title">
                            <svg className="logo-svg">
                                <use href="#logo"></use>
                            </svg>
                        </div>
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
                .navigationbar {
                    height: 70px;
                    display: flex;
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: end;
                    padding: 0 40px;
                }
                .navigationbar-link-wrapper {
                    padding: 10px 40px;
                    border-radius: 20px;
                    display: flex;
                    flex-direction: row;
                    height: 40px;
                    box-sizing: border-box;
                    align-items: center;
                    justify-content: center;
                }
                .navigationbar-link {
                    font-size: 15px;
                    color: white;
                    text-decoration: none;
                    margin-right: 10px;
                    display: flex;
                    flex-direction: column;
                    height: 40px;
                    box-sizing: border-box;
                    align-items: center;
                    justify-content: center;
                    padding: 0 20px;
                    border-radius: 20px;
                    transition: 0.1s;
                }
                .navigationbar-link:last-child {
                    margin-right: 0;
                }
                .navigationbar-link:hover {
                    backdrop-filter: blur(10px) saturate(100%);
                    background-color: rgba(10, 5, 30, 0.8);
                }
                .github-icon {
                    fill: white;
                    width: 20px;
                    height: 20px;
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
                    height: 100px;
                    margin: 0;
                    padding: 0;
                    margin-top: 180px;
                    text-align: center;
                }
                .logo-svg {
                    width: 400px;
                    stroke: white;
                    stroke-width: 3px;
                    stroke-linecap: round;
                    stroke-linejoin: round;
                    fill: none;
                    stroke-dasharray: 1000;
                    stroke-dashoffset: 1000;
                    -webkit-animation: dash 4s linear forwards;
                    animation: dash 4s linear forwards;
                    -webkit-animation-delay: 0.5s;
                    animation-delay: 0.5s;
                }
                @-webkit-keyframes dash {
                    to {
                        stroke-dashoffset: 0;
                    }
                }
                @keyframes dash {
                    to {
                        stroke-dashoffset: 0;
                    }
                }
                .description {
                    margin-top: 50px;
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
                    font-size: 15px;
                }
                .already-have-account > a {
                    font-weight: 700;
                    color: white;
                    text-decoration: underline;
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
                    width: 100%;
                    max-height: 1000px;
                    border-radius: 12px;
                    padding: 40px 6px 6px 6px;
                    flex: 0 1 auto;
                    min-width: 0;
                    box-sizing: border-box;
                    background-color: rgba(0, 0, 0, 0.8);
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
                    background-color: rgba(255, 255, 255, 0.8);
                }
                .window-button-2 {
                    background-color: rgba(255, 255, 255, 0.5);
                }
                .window-button-3 {
                    background-color: rgba(255, 255, 255, 0.2);
                }
                .app-container > .inner {
                    width: 100%;
                    height: 100%;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: row;
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
                    background-image: url("/assets/images/bg_06_1920.jpg?7");
                    background-size: 100% auto;
                    background-repeat: repeat-y;
                    background-color: #0a051e;
                    height: 100vh;
                    width: 100vw;
                    margin: 0;
                    padding: 0;
                    color: white;
                }
                @media screen and (min-width: 1920px) {
                    body {
                        background-image: url("/assets/images/bg_06_3840.jpg?7");
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
