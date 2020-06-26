import Head from "next/head"
import { GetServerSideProps } from "next"

export default ({ params }) => {
    return (
        <div>
            <Head>
                <title>チャンネル</title>
            </Head>
            <p>
                {params.community_id}/{params.channel_id}
            </p>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    return {
        props: { params },
    }
}
