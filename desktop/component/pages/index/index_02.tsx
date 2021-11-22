import { Button, LoginWithTwitterButton } from "./common"

export const Index02Component = () => {
    return (
        <>
            <div className="navigation-bar"></div>
            <div className="hero">
                <div className="description-area">
                    <div className="inner">
                        <div className="title"></div>
                        <div className="description">
                            <p>Belugaは文章や画像を投稿して楽しむチャット型SNSです。</p>
                            <p>リアルタイムなコミュニケーションを楽しむことができます。</p>
                        </div>
                        <div className="start-beluga">
                            <LoginWithTwitterButton themeColor="#ed4a5a" />
                            <Button
                                className="signup"
                                onClick={() => (location.href = "/signup")}
                                themeColor="#ed4a5a">
                                新規登録
                            </Button>
                        </div>
                        <div className="already-have-account">
                            すでにアカウントをお持ちの場合は<a href="/login">ログイン</a>
                            してください。
                        </div>
                    </div>
                </div>
                <div className="app-area">
                    <div className="app-container">
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
                    min-width: 700px;
                    width: 100%;
                }
                .title {
                    background-image: url("/assets/svg/logo.svg?1637570884");
                    background-repeat: no-repeat;
                    background-size: 400px auto;
                    background-position: top;
                    height: 100px;
                    margin: 0;
                    padding: 0;
                    margin-top: 150px;
                    margin-bottom: 50px;
                }
                .description {
                    color: white;
                    font-size: 18px;
                    text-align: center;
                }
                .description > p {
                    margin: 0;
                    padding: 0;
                    color: rgba(255, 255, 255, 0.9);
                }
                .start-beluga {
                    text-align: center;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    margin-top: 20px;
                }
                .already-have-account {
                    text-align: center;
                    flex-direction: row;
                    margin-top: 20px;
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 16px;
                }
                .already-have-account > a {
                    color: white;
                    text-decoration: underline;
                    font-weight: bold;
                }
                .app-area {
                    width: 50%;
                    flex: 1 1 auto;
                    padding: 50px 50px 50px 10px;
                    display: flex;
                    justify-content: center;
                    box-sizing: border-box;
                }
                .app-container {
                    width: 700px;
                    height: 100%;
                    border-radius: 15px;
                    padding: 10px;
                    flex: 0 1 auto;
                    box-sizing: border-box;
                    background: rgb(255, 255, 255);
                    background: linear-gradient(
                        0deg,
                        rgba(255, 255, 255, 1) 0%,
                        rgba(255, 255, 255, 1) 35%,
                        rgba(255, 189, 119, 1) 71%,
                        rgba(237, 76, 90, 1) 100%
                    );
                    filter: drop-shadow(4px 4px 50px rgba(0, 0, 0, 0.1));
                }
                .app-container > .inner {
                    background-color: white;
                    border-radius: 8px;
                    width: 100%;
                    height: 100%;
                    box-sizing: border-box;
                }
            `}</style>
            <style global jsx>{`
                body {
                    background-image: url("/assets/images/bg_02_1920.png?1637570884");
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
                        background-image: url("/assets/images/bg_02_3840.png?1637570884");
                    }
                }
                @font-face {
                    font-family: "Bungee";
                    font-style: normal;
                    font-weight: 400;
                    font-display: swap;
                    src: url(https://fonts.gstatic.com/s/bungee/v6/N0bU2SZBIuF2PU_0AnR1Gd8.woff2)
                        format("woff2");
                    unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1,
                        U+01AF-01B0, U+1EA0-1EF9, U+20AB;
                }
                @font-face {
                    font-family: "Bungee";
                    font-style: normal;
                    font-weight: 400;
                    font-display: swap;
                    src: url(https://fonts.gstatic.com/s/bungee/v6/N0bU2SZBIuF2PU_0A3R1Gd8.woff2)
                        format("woff2");
                    unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB,
                        U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
                }
                @font-face {
                    font-family: "Bungee";
                    font-style: normal;
                    font-weight: 400;
                    font-display: swap;
                    src: url(https://fonts.gstatic.com/s/bungee/v6/N0bU2SZBIuF2PU_0DXR1.woff2)
                        format("woff2");
                    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
                        U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215,
                        U+FEFF, U+FFFD;
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
