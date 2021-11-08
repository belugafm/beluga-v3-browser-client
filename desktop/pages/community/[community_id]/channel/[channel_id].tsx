import { GetServerSideProps } from "next"
import Head from "next/head"

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
