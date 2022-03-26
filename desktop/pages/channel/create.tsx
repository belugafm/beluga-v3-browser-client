export { getServerSideProps } from "../../component/app/next"

import { BackgroundImageBackdropFilterComponent } from "../../component/app/background_image"
import { ContainerComponent } from "../../component/app/container"
import { CreateChannelFormComponent } from "../../component/pages/channel/create"
import Head from "next/head"
import { HeaderComponent } from "../../component/app/header"
import { SidebarComponent } from "../../component/app/sidebar"
import { SidebarThemeComponent } from "../../component/app/sidebar/theme"
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
