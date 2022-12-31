export { getServerSideProps } from "../../../component/chat/next"

import { ChannelGroupListComponent } from "../../../component/chat/sidebar/channel_group_list"
import { ChannelListComponent } from "../../../component/chat/sidebar/channel_list"
import { AppComponent } from "../../../component/layout/app"
import { ContentGridComponent } from "../../../component/chat/content/layout"
import Head from "next/head"
import { SVGComponent } from "../../../component/chat/svg"
import { SidebarComponent } from "../../../component/layout/sidebar"
import { ThemeProvider } from "../../../component/theme"
import { swrFetchData } from "../../../swr/channel_group/combined/page"
import { EmptyComponent } from "../../../component/chat/sidebar/empty"
import { NavigationbarComponent } from "../../../component/layout/navigationbar"
import { SearchComponent } from "../../../component/chat/sidebar/search"
import { ChannelGroupCardComponent } from "../../../component/chat/sidebar/channel_group"

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
                <AppComponent
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
                </AppComponent>
            </ThemeProvider>
        </>
    )
}
