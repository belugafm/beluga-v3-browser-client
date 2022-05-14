export { getServerSideProps } from "../../component/chat/next"

import { AccountMenuComponent } from "../../component/chat/sidebar/account_menu"
import { BackgroundImageBackdropFilterComponent } from "../../component/chat/background_image"
import { ChannelGroupListComponent } from "../../component/chat/sidebar/channel_group"
import { ChannelListComponent } from "../../component/chat/sidebar/channel"
import { ContainerComponent } from "../../component/chat/container"
import { CreateChannelGroupFormComponent } from "../../component/page/channel_group/create"
import Head from "next/head"
import { HeaderComponent } from "../../component/chat/header"
import { LogoSidebarComponent } from "../../component/chat/sidebar/logo"
import { SVGComponent } from "../../component/chat/svg"
import { SidebarComponent } from "../../component/chat/sidebar"
import { SidebarThemeComponent } from "../../component/chat/sidebar/theme"
import { ThemeProvider } from "../../component/theme"
import { swrFetchData } from "../../swr/channel_group/combined/page"

export default ({ theme, query }) => {
    const parentId = query.parent_id ? Math.trunc(query.parent_id) : 1
    const { isLoading, errors, channels, channelGroup, channelGroups } = swrFetchData({
        id: parentId,
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
                <title>チャンネルグループの新規作成</title>
            </Head>
            <SVGComponent />
            <ThemeProvider userTheme={null} defaultGlobalThemeName={theme}>
                <ContainerComponent
                    pageContext={{
                        channelGroup: {
                            object: channelGroup,
                            messages: [],
                        },
                        initialDomainData: {
                            channels,
                            channelGroups,
                        },
                    }}>
                    <HeaderComponent />
                    <SidebarComponent>
                        <LogoSidebarComponent />
                        <AccountMenuComponent />
                        <ChannelGroupListComponent
                            activeChannelId={null}
                            channelIds={channels.map((channel) => channel.id)}
                            channelGroupIds={channelGroups.map((channelGroup) => channelGroup.id)}
                        />
                        <ChannelListComponent
                            activeChannelId={null}
                            channelIds={channels.map((channel) => channel.id)}
                        />
                        <SidebarThemeComponent />
                    </SidebarComponent>
                    <BackgroundImageBackdropFilterComponent url={null}>
                        <CreateChannelGroupFormComponent parentId={parentId} />
                    </BackgroundImageBackdropFilterComponent>
                </ContainerComponent>
            </ThemeProvider>
        </>
    )
}
