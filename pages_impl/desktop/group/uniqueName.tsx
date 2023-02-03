export { getServerSideProps } from "../../../component/desktop/chat/next"

import { ChannelGroupListComponent } from "../../../component/desktop/chat/sidebar/channel_group_list"
import { ChannelListComponent } from "../../../component/desktop/chat/sidebar/channel_list"
import { AppComponent } from "../../../component/desktop/layout/app"
import { ContentGridComponent } from "../../../component/desktop/chat/content/layout"
import Head from "next/head"
import { SVGComponent } from "../../../component/desktop/chat/svg"
import { SidebarComponent } from "../../../component/desktop/layout/sidebar"
import { ThemeProvider } from "../../../component/desktop/theme"
import { swrFetchData } from "../../../swr/page/channel_group"
import { EmptyComponent } from "../../../component/desktop/chat/sidebar/empty"
import { NavigationbarComponent } from "../../../component/desktop/layout/navigationbar"
import { SearchComponent } from "../../../component/desktop/chat/sidebar/search"
import { ChannelGroupCardComponent } from "../../../component/desktop/chat/sidebar/channel_group"
import { ContextProviderComponent } from "../../../component/desktop/layout/context_provider"

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
