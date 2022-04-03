export { getServerSideProps } from "../../component/app/next"

import { AccountMenuSidebarComponent } from "../../component/app/sidebar/account_menu"
import { BackgroundImageBackdropFilterComponent } from "../../component/app/background_image"
import { ChannelGroupSidebarComponent } from "../../component/app/sidebar/channel_group"
import { ChatAppStateContext } from "../../state/chat/store/app_state"
import { ChatColumnContainerComponent } from "../../component/chat/columns"
import { ChatComponent } from "../../component/chat"
import { ContainerComponent } from "../../component/app/container"
import Head from "next/head"
import { HeaderComponent } from "../../component/app/header"
import { LogoSidebarComponent } from "../../component/app/sidebar/logo"
import { SVGComponent } from "../../component/app/svg"
import { SidebarComponent } from "../../component/app/sidebar"
import { SidebarThemeComponent } from "../../component/app/sidebar/theme"
import { ThemeProvider } from "../../component/theme"
import { swrFetchData } from "../../swr/channel/combined/page"

export default ({ theme, query }) => {
    const { isLoading, errors, channels, channel, channelGroups, messages } = swrFetchData({
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
                <title>{channel.name}</title>
            </Head>
            <SVGComponent />
            <ThemeProvider userTheme={null} defaultGlobalThemeName={theme}>
                <ContainerComponent>
                    <HeaderComponent />
                    <SidebarComponent>
                        <LogoSidebarComponent />
                        <AccountMenuSidebarComponent />
                        <ChannelGroupSidebarComponent
                            activeChannel={channel}
                            channels={channels}
                            channelGroups={channelGroups}
                        />
                        <SidebarThemeComponent />
                    </SidebarComponent>
                    <BackgroundImageBackdropFilterComponent url={null}>
                        <ChatAppStateContext.Provider value={{ columns: [] }}>
                            <ChatComponent
                                context={{
                                    channel: {
                                        object: channel,
                                        messages: messages,
                                    },
                                }}
                            />
                        </ChatAppStateContext.Provider>
                    </BackgroundImageBackdropFilterComponent>
                </ContainerComponent>
            </ThemeProvider>
        </>
    )
}
