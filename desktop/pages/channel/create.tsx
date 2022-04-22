export { getServerSideProps } from "../../component/chat/next"

import { AccountMenuSidebarComponent } from "../../component/chat/sidebar/account_menu"
import { BackgroundImageBackdropFilterComponent } from "../../component/chat/background_image"
import { ChannelGroupSidebarComponent } from "../../component/chat/sidebar/channel_group"
import { ContainerComponent } from "../../component/chat/container"
import { CreateChannelFormComponent } from "../../component/pages/channel/create"
import Head from "next/head"
import { HeaderComponent } from "../../component/chat/header"
import { LogoSidebarComponent } from "../../component/chat/sidebar/logo"
import { SVGComponent } from "../../component/chat/svg"
import { SidebarComponent } from "../../component/chat/sidebar"
import { SidebarThemeComponent } from "../../component/chat/sidebar/theme"
import { ThemeProvider } from "../../component/theme"
import { swrListAllForChannelGroup } from "../../swr/channel_group/combined/list_all"

export default ({ theme, query }) => {
    const parentChannelGroupId = query.parent_channel_group_id
        ? Math.trunc(query.parent_channel_group_id)
        : 1
    const { isLoading, errors, channels, channelGroup, channelGroups } = swrListAllForChannelGroup({
        id: parentChannelGroupId,
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
                <title>チャンネルの新規作成</title>
            </Head>
            <SVGComponent />
            <ThemeProvider userTheme={null} defaultGlobalThemeName={theme}>
                <ContainerComponent
                    pageContext={{
                        channelGroup: {
                            object: channelGroup,
                            messages: [],
                        },
                    }}>
                    <HeaderComponent />
                    <SidebarComponent>
                        <LogoSidebarComponent />
                        <AccountMenuSidebarComponent />
                        <ChannelGroupSidebarComponent
                            activeChannel={null}
                            channels={channels}
                            channelGroups={channelGroups}
                        />
                        <SidebarThemeComponent />
                    </SidebarComponent>
                    <BackgroundImageBackdropFilterComponent url={null}>
                        <CreateChannelFormComponent parentChannelGroupId={parentChannelGroupId} />
                    </BackgroundImageBackdropFilterComponent>
                </ContainerComponent>
            </ThemeProvider>
        </>
    )
}
