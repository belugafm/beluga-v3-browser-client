import Head from "next/head"
import { GetServerSideProps } from "next"

export default function App({ params }) {
    return (
        <div>
            <Head>
                <title>チャンネル</title>
            </Head>
            <p>{params.channel_id}</p>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    return {
        props: { params },
    }
}
