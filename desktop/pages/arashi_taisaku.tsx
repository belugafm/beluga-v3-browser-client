export { getServerSideProps } from "../component/app"

import { App } from "../component/app"
import Head from "next/head"
import { ThemeProvider } from "../component/theme"

export default ({ theme }) => {
    return (
        <>
            <Head>
                <title>荒らし対策について</title>
            </Head>
            <div className="container">
                <h1>荒らし対策について</h1>
                <div className="image-container">
                    <div className="ice-cream"></div>
                </div>
                <div className="description">
                    <p>
                        2020年から2021年にかけて、Belugaは1人の荒らしユーザーによる攻撃を受け続けサイト閉鎖に追い込まれました。
                        この荒らしユーザーはほぼ毎日新しいアカウントを作り、当時のBelugaのアクティブユーザー数よりもはるかに多い数のアカウントを駆使して迷惑行為を繰り返しました。
                        オープンなチャット型SNSの性質上、悪意のあるユーザーを完全に排除することは難しく、Belugaは新規ユーザーの登録を停止し事実上閉鎖しました。
                    </p>
                    <p>
                        この経験を踏まえ新たに開発した現行バージョンのBelugaでは、新規登録されたユーザーを原則的に信頼せず大幅な機能制限を行います。
                        そのユーザーが信頼できるかどうかは管理者が判断し、信頼できる場合は機能制限を解除します。ただし、このやり方ではサイトの規模が大きくなった時に破綻するため、何らかの基準を設け、それをクリアしているユーザーは機能制限が自動的に解除されるようにします。
                        現在運用されている基準は「登録から1年以上経過しているTwitterアカウントでBelugaにログインしている」「すでに信頼されているユーザーから招待されている」の2つです。
                        このような基準になっているのは、Twitterアカウントを大量に取得し、かつ1年以上凍結されずに保持し続けることは難しいと考えているからです。
                    </p>
                    <p>
                        機能制限されているユーザーは投稿を削除することができません。これはBelugaで荒らし行為が行われた際にプロバイダ通報するための措置です。
                    </p>
                </div>
            </div>
            <style global jsx>{`
                body {
                    background-color: white;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    width: 600px;
                    margin: 0 auto;
                }
                h1 {
                    text-align: center;
                    font-size: 24px;
                    margin: 40px 0;
                    padding: 0;
                }
                .image-container {
                    text-align: center;
                    margin-bottom: 30px;
                }
                .ice-cream {
                    height: 200px;
                    background-image: url("/assets/images/something_went_wrong.png");
                    background-repeat: no-repeat;
                    background-size: 200px auto;
                    background-position: center;
                }
                .description {
                    font-size: 16px;
                    line-height: 24px;
                }
                .description > p {
                    margin: 0;
                    margin-bottom: 1em;
                    padding: 0;
                }
            `}</style>
        </>
    )
}
