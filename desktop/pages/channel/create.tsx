export { getServerSideProps } from "../../component/chat/next"

import { BackgroundImageBackdropFilterComponent } from "../../component/chat/background_image"
import { ContainerComponent } from "../../component/chat/container"
import { CreateChannelFormComponent } from "../../component/pages/channel/create"
import Head from "next/head"
import { HeaderComponent } from "../../component/chat/header"
import { SidebarComponent } from "../../component/chat/sidebar"
import { SidebarThemeComponent } from "../../component/chat/sidebar/theme"
import { ThemeProvider } from "../../component/theme"

export default ({ theme, query }) => {
    const parentChannelGroupId = query.parent_channel_group_id
        ? Math.trunc(query.parent_channel_group_id)
        : 48
    return (
        <>
            <Head>
                <title>チャンネルの新規作成</title>
            </Head>
            <ThemeProvider userTheme={null} defaultGlobalThemeName={theme}>
                <ContainerComponent>
                    <HeaderComponent />
                    <SidebarComponent>
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
