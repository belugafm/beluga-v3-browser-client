export { getServerSideProps } from "../../../../component/next"

import { ChannelGroupListComponent } from "../../../../component/desktop/chat/sidebar/ChannelGroupList"
import { ChannelListComponent } from "../../../../component/desktop/chat/sidebar/ChannelList"
import { AppComponent } from "../../../../component/desktop/layout/App"
import { ContentGridComponent } from "../../../../component/desktop/chat/layout/ContentGrid"
import Head from "next/head"
import { SVGComponent } from "../../../../component/SVG"
import { SidebarComponent } from "../../../../component/desktop/layout/Sidebar"
import { ThemeProvider } from "../../../../component/Theme"
import { swrFetchData } from "../../../../swr/page/channel"
import { ServerSideProps } from "../../../../component/next"
import { NavigationbarComponent } from "../../../../component/desktop/layout/Navigationbar"
import { SearchComponent } from "../../../../component/desktop/chat/sidebar/Search"
import { ChannelGroupCardComponent } from "../../../../component/desktop/chat/sidebar/ChannelGroupCard"
import { ContextProviderComponent } from "../../../../component/desktop/layout/ContextProvider"

export default ({ theme, query }: ServerSideProps) => {
    const { isLoading, errors, channels, channel, channelGroups, messages, parentChannelGroup } =
        swrFetchData({
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
    parentChannelGroup.child_channel_group_ids = channelGroups.map(
        (channelGroup) => channelGroup.id
    )
    return (
        <>
            <Head>
                <title>{channel.name}</title>
            </Head>
            <SVGComponent />
            <ThemeProvider userTheme={null} defaultGlobalThemeName={theme}>
                <AppComponent>
                    <ContextProviderComponent
                        pageContext={{
                            channel: {
                                object: channel,
                                messages,
                                parentChannelGroup,
                            },
                            initialDomainData: {
                                channels,
                                channelGroups,
                            },
                        }}>
                        <NavigationbarComponent />
                        <SidebarComponent>
                            <SearchComponent />
                            <ChannelGroupListComponent
                                channelGroupIds={channelGroups.map(
                                    (channelGroup) => channelGroup.id
                                )}
                            />
                            <ChannelListComponent
                                activeChannelId={channel.id}
                                channelIds={channels.map((channel) => channel.id)}
                            />
                            <ChannelGroupCardComponent channelGroupId={parentChannelGroup.id} />
                        </SidebarComponent>
                        <ContentGridComponent />
                    </ContextProviderComponent>
                </AppComponent>
            </ThemeProvider>
        </>
    )
}
