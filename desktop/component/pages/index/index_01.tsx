import { Button, LoginWithTwitterButton } from "./common"

export const Index01Component = () => {
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
                    justify-content: flex-start;
                    box-sizing: border-box;
                }
                .app-container {
                    width: 800px;
                    height: 100%;
                    border-radius: 15px;
                    padding: 10px;
                    flex: 0 1 auto;
                    box-sizing: border-box;
                    background: rgb(255, 255, 255);
                    background: linear-gradient(
                        330deg,
                        rgba(255, 255, 255, 1) 0%,
                        rgba(255, 255, 255, 1) 65%,
                        rgba(32, 149, 224, 1) 85%,
                        rgba(11, 50, 185, 1) 100%
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
                #__next > div {
                    height: 100%;
                    width: 100%;
                    position: relative;
                }
            `}</style>
        </>
    )
}
