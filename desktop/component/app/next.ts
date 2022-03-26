import Cookie from "cookie"
import { GetServerSideProps } from "next"

export const getServerSideProps: GetServerSideProps = async (context) => {
    const cookie = Cookie.parse(context.req.headers.cookie || "")
    const { theme, user_name } = cookie
    const { params, query } = context
    return {
        props: {
            theme: theme ? theme : null,
            user_name: user_name ? user_name : null,
            params: params ? params : {},
            query: query ? query : {},
        },
    }
}
