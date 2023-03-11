export { getServerSideProps } from "../../../component/next"

import { ChannelGroupListComponent } from "../../../component/desktop/chat/sidebar/ChannelGroupList"
import { ChannelListComponent } from "../../../component/desktop/chat/sidebar/ChannelList"
import { AppComponent } from "../../../component/desktop/layout/app"
import { CreateChannelFormComponent } from "../../../component/desktop/page/channel/create"
import Head from "next/head"
import { SVGComponent } from "../../../component/svg"
import { SidebarComponent } from "../../../component/desktop/layout/sidebar"
import { ContentComponent } from "../../../component/desktop/layout/content"
import { ThemeProvider } from "../../../component/theme"
import { swrFetchData } from "../../../swr/page/channel_group"
import { NavigationbarComponent } from "../../../component/desktop/layout/navigationbar"
import { SearchComponent } from "../../../component/desktop/chat/sidebar/Search"
import { EmptyComponent } from "../../../component/desktop/chat/sidebar/Empty"
import { ChannelGroupCardComponent } from "../../../component/desktop/chat/sidebar/ChannelGroupCard"
import { ContextProviderComponent } from "../../../component/desktop/layout/context_provider"

export default ({ theme, query }) => {
    const parentChannelGroupId = query.parent_channel_group_id
        ? Math.trunc(query.parent_channel_group_id)
        : 1
    const { isLoading, errors, channels, channelGroup, channelGroups } = swrFetchData({
        id: parentChannelGroupId,
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
    channelGroup.child_channel_group_ids = channelGroupIds
    return (
        <>
            <Head>
                <title>チャンネルの新規作成</title>
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
                            <ChannelGroupCardComponent channelGroupId={parentChannelGroupId} />
                        </SidebarComponent>
                        <ContentComponent>
                            <CreateChannelFormComponent channelGroup={channelGroup} />
                        </ContentComponent>
                    </ContextProviderComponent>
                </AppComponent>
            </ThemeProvider>
        </>
    )
}
