export { getServerSideProps } from "../../component/app/next"

import { BackgroundImageBackdropFilterComponent } from "../../component/app/background_image"
import { ContainerComponent } from "../../component/app/container"
import { CreateChannelGroupFormComponent } from "../../component/pages/channel_group/create"
import Head from "next/head"
import { HeaderComponent } from "../../component/app/header"
import { SidebarComponent } from "../../component/app/sidebar"
import { SidebarThemeComponent } from "../../component/app/sidebar/theme"
import { ThemeProvider } from "../../component/theme"
import { swrListAllForChannelGroup } from "../../swr/channel_group/combined/list_all"

export default ({ theme, query }) => {
    const { isLoading, errors, channels, channelGroup, channelGroups } = swrListAllForChannelGroup({
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
    return (
        <>
            <Head>
                <title>{channelGroup.name}</title>
            </Head>
            <ThemeProvider userTheme={null} defaultGlobalThemeName={theme}>
                <ContainerComponent>
                    <HeaderComponent />
                    <SidebarComponent>
                        <SidebarThemeComponent />
                    </SidebarComponent>
                    <BackgroundImageBackdropFilterComponent url={null}>
                        <CreateChannelGroupFormComponent parentId={1} />
                    </BackgroundImageBackdropFilterComponent>
                </ContainerComponent>
            </ThemeProvider>
        </>
    )
}
