export { getServerSideProps } from "../../../component/next"

import { ChannelGroupListComponent } from "../../../component/desktop/chat/sidebar/channel_group_list"
import { ChannelListComponent } from "../../../component/desktop/chat/sidebar/channel_list"
import { AppComponent } from "../../../component/desktop/layout/app"
import { ContentGridComponent } from "../../../component/desktop/chat/content/layout"
import Head from "next/head"
import { SVGComponent } from "../../../component/svg"
import { SidebarComponent } from "../../../component/desktop/layout/sidebar"
import { ThemeProvider } from "../../../component/theme"
import { swrFetchData } from "../../../swr/page/channel"
import { ServerSideProps } from "../../../component/next"
import { NavigationbarComponent } from "../../../component/desktop/layout/navigationbar"
import { SearchComponent } from "../../../component/desktop/chat/sidebar/search"
import { ChannelGroupCardComponent } from "../../../component/desktop/chat/sidebar/channel_group"
import { ContextProviderComponent } from "../../../component/desktop/layout/context_provider"

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
