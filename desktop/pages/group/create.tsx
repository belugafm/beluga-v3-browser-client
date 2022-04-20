export { getServerSideProps } from "../../component/chat/next"

import { BackgroundImageBackdropFilterComponent } from "../../component/chat/background_image"
import { ContainerComponent } from "../../component/chat/container"
import { CreateChannelGroupFormComponent } from "../../component/pages/channel_group/create"
import Head from "next/head"
import { HeaderComponent } from "../../component/chat/header"
import { SidebarComponent } from "../../component/chat/sidebar"
import { SidebarThemeComponent } from "../../component/chat/sidebar/theme"
import { ThemeProvider } from "../../component/theme"

export default ({ theme, query }) => {
    const parentId = query.parent_id ? Math.trunc(query.parent_id) : 81
    return (
        <>
            <Head>
                <title>チャンネルグループの新規作成</title>
            </Head>
            <ThemeProvider userTheme={null} defaultGlobalThemeName={theme}>
                <ContainerComponent>
                    <HeaderComponent />
                    <SidebarComponent>
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
