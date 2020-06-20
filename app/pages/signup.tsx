import Head from "next/head"
import { GetStaticProps } from "next"

export default function App({}) {
    return (
        <div>
            <Head>
                <title>アカウント登録</title>
            </Head>
        </div>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    return {
        props: {},
    }
}
