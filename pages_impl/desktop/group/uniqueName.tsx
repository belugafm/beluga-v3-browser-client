export { getServerSideProps } from "../../../component/chat/next"

import { BackgroundImageBackdropFilterComponent } from "../../../component/chat/background_image"
import { ChannelGroupListComponent } from "../../../component/chat/sidebar/channel_group"
import { ChannelListComponent } from "../../../component/chat/sidebar/channel"
import { ContainerComponent } from "../../../component/chat/container"
import { ContentGridComponent } from "../../../component/chat/content/layout"
import Head from "next/head"
import { HeaderComponent } from "../../../component/chat/header"
import { SVGComponent } from "../../../component/chat/svg"
import { SidebarComponent } from "../../../component/chat/sidebar"
import { SidebarThemeComponent } from "../../../component/chat/sidebar/theme"
import { ThemeProvider } from "../../../component/theme"
import { swrFetchData } from "../../../swr/channel_group/combined/page"
import { EmptyComponent } from "../../../component/chat/sidebar/empty"
import { NavigationbarComponent } from "../../../component/chat/navigationbar"
import { SearchComponent } from "../../../component/chat/sidebar/search"

export default ({ theme, query }) => {
    const { isLoading, errors, channels, channelGroup, channelGroups, messages } = swrFetchData({
        uniqueName: query.uniqueName,
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
                <title>{channelGroup.name}</title>
            </Head>
            <SVGComponent />
            <ThemeProvider userTheme={null} defaultGlobalThemeName={theme}>
                <ContainerComponent
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
                        <SidebarThemeComponent />
                    </SidebarComponent>
                    <BackgroundImageBackdropFilterComponent url={null}>
                        <ContentGridComponent />
                    </BackgroundImageBackdropFilterComponent>
                </ContainerComponent>
            </ThemeProvider>
        </>
    )
}
