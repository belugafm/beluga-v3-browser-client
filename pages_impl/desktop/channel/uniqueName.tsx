export { getServerSideProps } from "../../../component/chat/next"

import { BackgroundImageBackdropFilterComponent } from "../../../component/chat/background_image"
import { ChannelGroupListComponent } from "../../../component/chat/sidebar/channel_group"
import { ChannelListComponent } from "../../../component/chat/sidebar/channel"
import { ContainerComponent } from "../../../component/chat/container"
import { ContentGridComponent } from "../../../component/chat/content/layout"
import Head from "next/head"
import { SVGComponent } from "../../../component/chat/svg"
import { SidebarComponent } from "../../../component/chat/sidebar"
import { SidebarThemeComponent } from "../../../component/chat/sidebar/theme"
import { ThemeProvider } from "../../../component/theme"
import { swrFetchData } from "../../../swr/channel/combined/page"
import { ServerSideProps } from "../../../component/chat/next"
import { NavigationbarComponent } from "../../../component/chat/navigationbar"
import { SearchComponent } from "../../../component/chat/sidebar/search"

export default ({ theme, query }: ServerSideProps) => {
    const { isLoading, errors, channels, channel, channelGroups, messages, parentChannelGroup } =
        swrFetchData({
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
    return (
        <>
            <Head>
                <title>{channel.name}</title>
            </Head>
            <SVGComponent />
            <ThemeProvider userTheme={null} defaultGlobalThemeName={theme}>
                <ContainerComponent
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
                    <BackgroundImageBackdropFilterComponent url={null}>
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
                        </SidebarComponent>
                        <ContentGridComponent />
                    </BackgroundImageBackdropFilterComponent>
                </ContainerComponent>
            </ThemeProvider>
        </>
    )
}
