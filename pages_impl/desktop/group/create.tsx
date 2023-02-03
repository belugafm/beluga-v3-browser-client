export { getServerSideProps } from "../../../component/desktop/chat/next"

import { ChannelGroupListComponent } from "../../../component/desktop/chat/sidebar/channel_group_list"
import { ChannelListComponent } from "../../../component/desktop/chat/sidebar/channel_list"
import { AppComponent } from "../../../component/desktop/layout/app"
import { CreateChannelGroupFormComponent } from "../../../component/desktop/page/channel_group/create"
import Head from "next/head"
import { SVGComponent } from "../../../component/desktop/chat/svg"
import { SidebarComponent } from "../../../component/desktop/layout/sidebar"
import { ThemeProvider } from "../../../component/desktop/theme"
import { swrFetchData } from "../../../swr/page/channel_group"
import { NavigationbarComponent } from "../../../component/desktop/layout/navigationbar"
import { SearchComponent } from "../../../component/desktop/chat/sidebar/search"
import { EmptyComponent } from "../../../component/desktop/chat/sidebar/empty"
import { ChannelGroupCardComponent } from "../../../component/desktop/chat/sidebar/channel_group"
import { ContentComponent } from "../../../component/desktop/layout/content"
import { ContextProviderComponent } from "../../../component/desktop/layout/context_provider"

export default ({ theme, query }) => {
    const parentId = query.parent_id ? Math.trunc(query.parent_id) : 1
    const { isLoading, errors, channels, channelGroup, channelGroups } = swrFetchData({
        id: parentId,
    })
    if (isLoading) {
        return null
    }
    for (const error of errors) {
        if (error) {
            return <div>エラー</div>
        }
    }
    if (channels == null) {
        return <div>エラー</div>
    }
    if (channelGroups == null) {
        return <div>エラー</div>
    }
    const channelGroupIds = channelGroups.map((channelGroup) => channelGroup.id)
    const channelIds = channels.map((channel) => channel.id)
    return (
        <>
            <Head>
                <title>チャンネルグループの新規作成</title>
            </Head>
            <SVGComponent />
            <ThemeProvider userTheme={null} defaultGlobalThemeName={theme}>
                <AppComponent>
                    <ContextProviderComponent
                        pageContext={{
                            channelGroup: {
                                object: channelGroup,
                                messages: [],
                            },
                            initialDomainData: {
                                channels,
                                channelGroups,
                            },
                        }}>
                        <NavigationbarComponent />
                        <SidebarComponent>
                            <SearchComponent />
                            <ChannelGroupListComponent channelGroupIds={channelGroupIds} />
                            <ChannelListComponent activeChannelId={null} channelIds={channelIds} />
                            <EmptyComponent
                                channelGroupIds={channelGroupIds}
                                channelIds={channelIds}
                                channelGroupId={channelGroup.id}
                            />
                            <ChannelGroupCardComponent channelGroupId={parentId} />
                        </SidebarComponent>
                        <ContentComponent>
                            <CreateChannelGroupFormComponent parentId={parentId} />
                        </ContentComponent>
                    </ContextProviderComponent>
                </AppComponent>
            </ThemeProvider>
        </>
    )
}
