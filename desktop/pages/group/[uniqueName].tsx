export { getServerSideProps } from "../../component/chat/next"

import { AccountMenuSidebarComponent } from "../../component/chat/sidebar/account_menu"
import { BackgroundImageBackdropFilterComponent } from "../../component/chat/background_image"
import { ChannelGroupSidebarComponent } from "../../component/chat/sidebar/channel_group"
import { ContainerComponent } from "../../component/chat/container"
import { ContentGridComponent } from "../../component/chat/content/layout"
import Head from "next/head"
import { HeaderComponent } from "../../component/chat/header"
import { LogoSidebarComponent } from "../../component/chat/sidebar/logo"
import { SVGComponent } from "../../component/chat/svg"
import { SidebarComponent } from "../../component/chat/sidebar"
import { SidebarThemeComponent } from "../../component/chat/sidebar/theme"
import { ThemeProvider } from "../../component/theme"
import { swrFetchData } from "../../swr/channel_group/combined/page"

export default ({ theme, query }) => {
    const { isLoading, errors, channels, channelGroup, channelGroups, messages } = swrFetchData({
        uniqueName: query.uniqueName,
    })
    if (isLoading) {
        return null
    }
    if (errors[0]) {
        return <div>エラー</div>
    }
    if (errors[1]) {
        return <div>エラー</div>
    }
    if (errors[2]) {
        return <div>エラー</div>
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
                            channelGroups: [],
                        },
                    }}>
                    <HeaderComponent />
                    <SidebarComponent>
                        <LogoSidebarComponent />
                        <AccountMenuSidebarComponent />
                        <ChannelGroupSidebarComponent
                            activeChannelId={null}
                            channelIds={channels.map((channel) => channel.id)}
                            channelGroupIds={channelGroups.map((channelGroup) => channelGroup.id)}
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
