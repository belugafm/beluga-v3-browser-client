export { getServerSideProps } from "../../component/next"

import { ChannelGroupListComponent } from "../../component/desktop/chat/sidebar/channel_group_list"
import { ChannelListComponent } from "../../component/desktop/chat/sidebar/channel_list"
import { AppComponent } from "../../component/desktop/layout/app"
import { ContentGridComponent } from "../../component/desktop/chat/content/layout"
import Head from "next/head"
import { SVGComponent } from "../../component/svg"
import { SidebarComponent } from "../../component/desktop/layout/sidebar"
import { ThemeProvider } from "../../component/theme"
import { swrFetchData } from "../../swr/page/search"
import { ServerSideProps } from "../../component/next"
import { NavigationbarComponent } from "../../component/desktop/layout/navigationbar"
import { ContextProviderComponent } from "../../component/desktop/layout/context_provider"
import { MessageSearchQueryT } from "../../api/methods/messages"

export default ({ theme, query }: ServerSideProps) => {
    const searchQuery: MessageSearchQueryT = {
        text: query.text,
        channelId: query.channel_id ? Number(query.channel_id) : undefined,
        userId: query.user_id ? Number(query.user_id) : undefined,
        sinceId: query.since_id ? Number(query.since_id) : undefined,
        maxId: query.max_id ? Number(query.max_id) : undefined,
        sinceDate: query.since_date ? Number(query.since_date) : undefined,
        untilDate: query.until_date ? Number(query.until_date) : undefined,
        limit: query.limit ? Number(query.limit) : undefined,
        // @ts-ignore
        sortBy: query.sort_by ? query.sort_by : undefined,
        // @ts-ignore
        sortOrder: query.sort_order ? query.sort_order : undefined,
    }
    for (const key of Object.keys(searchQuery)) {
        if (query[key] == null) {
            delete query[key]
        }
    }
    const { isLoading, errors, messages } = swrFetchData(searchQuery)
    for (const error of errors) {
        if (error) {
            return <div>問題が発生しました。再度ログインしてください。</div>
        }
    }
    if (isLoading) {
        return null
    }
    return (
        <>
            <Head>
                <title>検索</title>
            </Head>
            <SVGComponent />
            <ThemeProvider userTheme={null} defaultGlobalThemeName={theme}>
                <AppComponent>
                    <ContextProviderComponent
                        pageContext={{
                            search: {
                                messages: messages,
                                query: searchQuery,
                            },
                            initialDomainData: {
                                channels: [],
                                channelGroups: [],
                            },
                        }}>
                        <NavigationbarComponent />
                        <SidebarComponent>
                            <div>a</div>
                        </SidebarComponent>
                        <ContentGridComponent />
                    </ContextProviderComponent>
                </AppComponent>
            </ThemeProvider>
        </>
    )
}
