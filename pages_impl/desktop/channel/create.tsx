export { getServerSideProps } from "../../../component/chat/next"

import { BackgroundImageBackdropFilterComponent } from "../../../component/chat/background_image"
import { ChannelGroupListComponent } from "../../../component/chat/sidebar/channel_group_list"
import { ChannelListComponent } from "../../../component/chat/sidebar/channel_list"
import { ContainerComponent } from "../../../component/chat/container"
import { CreateChannelFormComponent } from "../../../component/page/channel/create"
import Head from "next/head"
import { SVGComponent } from "../../../component/chat/svg"
import { SidebarComponent } from "../../../component/chat/sidebar"
import { ThemeProvider } from "../../../component/theme"
import { swrFetchData } from "../../../swr/channel_group/combined/page"
import { NavigationbarComponent } from "../../../component/chat/navigationbar"
import { SearchComponent } from "../../../component/chat/sidebar/search"
import { EmptyComponent } from "../../../component/chat/sidebar/empty"
import { ChannelGroupCardComponent } from "../../../component/chat/sidebar/channel_group"

export default ({ theme, query }) => {
    const parentChannelGroupId = query.parent_channel_group_id
        ? Math.trunc(query.parent_channel_group_id)
        : 1
    const { isLoading, errors, channels, channelGroup, channelGroups } = swrFetchData({
        id: parentChannelGroupId,
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
                        <ChannelGroupCardComponent channelGroupId={parentChannelGroupId} />
                    </SidebarComponent>
                    <BackgroundImageBackdropFilterComponent url={null}>
                        <CreateChannelFormComponent channelGroup={channelGroup} />
                    </BackgroundImageBackdropFilterComponent>
                </ContainerComponent>
            </ThemeProvider>
        </>
    )
}
