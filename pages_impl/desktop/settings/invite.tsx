export { getServerSideProps } from "../../../component/chat/next"

import { ChannelGroupListComponent } from "../../../component/chat/sidebar/channel_group_list"
import { ChannelListComponent } from "../../../component/chat/sidebar/channel_list"
import { AppComponent } from "../../../component/layout/app"
import { CreateChannelGroupFormComponent } from "../../../component/page/channel_group/create"
import Head from "next/head"
import { SVGComponent } from "../../../component/chat/svg"
import { SidebarComponent } from "../../../component/layout/sidebar"
import { ThemeProvider } from "../../../component/theme"
import { swrFetchData } from "../../../swr/channel_group/combined/page"
import { NavigationbarComponent } from "../../../component/layout/navigationbar"
import { SearchComponent } from "../../../component/chat/sidebar/search"
import { EmptyComponent } from "../../../component/chat/sidebar/empty"
import { ChannelGroupCardComponent } from "../../../component/chat/sidebar/channel_group"
import { ContentComponent } from "../../../component/layout/content"

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
                <title>招待を作成</title>
            </Head>
            <SVGComponent />
            <ThemeProvider userTheme={null} defaultGlobalThemeName={theme}>
                <AppComponent>
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
                </AppComponent>
            </ThemeProvider>
        </>
    )
}
