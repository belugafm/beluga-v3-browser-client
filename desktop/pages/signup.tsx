import Head from "next/head"
import { GetStaticProps } from "next"
import { SignupFormComponent } from "../components/signup"

export default function App({}) {
    return (
        <div>
            <Head>
                <title>アカウント登録</title>
            </Head>
            <div>
                <SignupFormComponent />
            </div>
        </div>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    return {
        props: {},
    }
}
