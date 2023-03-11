export { getServerSideProps } from "../../../../component/next"

import { AppComponent } from "../../../../component/desktop/layout/App"
import Head from "next/head"
import { SVGComponent } from "../../../../component/SVG"
import { SidebarComponent } from "../../../../component/desktop/layout/Sidebar"
import { ThemeProvider } from "../../../../component/Theme"
import { NavigationbarComponent } from "../../../../component/desktop/layout/Navigationbar"
import { ContentComponent } from "../../../../component/desktop/layout/Content"
import { SettingsMenuComponent } from "../Sidebar"
import { ProfileImageComponent } from "./ProfileImage"

export default ({ theme, query }) => {
    return (
        <>
            <Head>
                <title>アカウント情報</title>
            </Head>
            <SVGComponent />
            <ThemeProvider userTheme={null} defaultGlobalThemeName={theme}>
                <AppComponent>
                    <NavigationbarComponent />
                    <SidebarComponent>
                        <SettingsMenuComponent />
                    </SidebarComponent>
                    <ContentComponent>
                        <ProfileImageComponent />
                    </ContentComponent>
                </AppComponent>
            </ThemeProvider>
        </>
    )
}
