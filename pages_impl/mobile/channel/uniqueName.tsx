export { getServerSideProps } from "../../../component/next"

import { AppComponent } from "../../../component/mobile/layout/App"
import Head from "next/head"
import { SVGComponent } from "../../../component/SVG"
import { ThemeProvider } from "../../../component/Theme"
import { swrFetchData } from "../../../swr/page/channel"
import { ServerSideProps } from "../../../component/next"
import { NavigationbarComponent } from "../../../component/mobile/layout/Navigationbar"
import { ContextProviderComponent } from "../../../component/mobile/layout/ContextProvider"
import { ChannelNavigationbarComponent } from "../../../component/mobile/navigationbar/Channel"
import { DrawerComponent } from "../../../component/mobile/layout/Drawer"
import { ChannelContentComponent } from "../../../component/mobile/content/Channel"
import { SidebarComponent } from "../../../component/mobile/drawer/Sidebar"
import { ChannelListComponent } from "../../../component/mobile/drawer/sidebar/ChannelList"
import { ChannelGroupListComponent } from "../../../component/mobile/drawer/sidebar/ChannelGroupList"
import { ChannelGroupCardComponent } from "../../../component/mobile/drawer/sidebar/ChannelGroup"

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
                        <ChannelContentComponent />
                        <NavigationbarComponent>
                            <ChannelNavigationbarComponent channel={channel} />
                        </NavigationbarComponent>
                        <DrawerComponent>
                            <SidebarComponent>
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
                        </DrawerComponent>
                    </ContextProviderComponent>
                </AppComponent>
            </ThemeProvider>
        </>
    )
}
