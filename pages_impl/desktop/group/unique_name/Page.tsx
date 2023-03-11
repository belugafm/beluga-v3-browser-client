export { getServerSideProps } from "../../../../component/next"

import { ChannelGroupListComponent } from "../../../../component/desktop/chat/sidebar/ChannelGroupList"
import { ChannelListComponent } from "../../../../component/desktop/chat/sidebar/ChannelList"
import { AppComponent } from "../../../../component/desktop/layout/App"
import { ContentGridComponent } from "../../../../component/desktop/chat/layout/ContentGrid"
import Head from "next/head"
import { SVGComponent } from "../../../../component/SVG"
import { SidebarComponent } from "../../../../component/desktop/layout/Sidebar"
import { ThemeProvider } from "../../../../component/Theme"
import { swrFetchData } from "../../../../swr/page/channel_group"
import { EmptyComponent } from "../../../../component/desktop/chat/sidebar/Empty"
import { NavigationbarComponent } from "../../../../component/desktop/layout/Navigationbar"
import { SearchComponent } from "../../../../component/desktop/chat/sidebar/Search"
import { ChannelGroupCardComponent } from "../../../../component/desktop/chat/sidebar/ChannelGroupCard"
import { ContextProviderComponent } from "../../../../component/desktop/layout/ContextProvider"

export default ({ theme, query }) => {
    const { isLoading, errors, channels, channelGroup, channelGroups, messages } = swrFetchData({
        uniqueName: query.uniqueName,
    })
    for (const error of errors) {
        if (error) {
            return <div>問題が発生しました。再度ログインしてください。</div>
        }
    }
    if (isLoading) {
        return null
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
                <title>{channelGroup.name}</title>
            </Head>
            <SVGComponent />
            <ThemeProvider userTheme={null} defaultGlobalThemeName={theme}>
                <AppComponent>
                    <ContextProviderComponent
                        pageContext={{
                            channelGroup: {
                                object: channelGroup,
                                messages: messages,
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
                            <ChannelGroupCardComponent channelGroupId={channelGroup.id} />
                        </SidebarComponent>
                        <ContentGridComponent />
                    </ContextProviderComponent>
                </AppComponent>
            </ThemeProvider>
        </>
    )
}
