export { getServerSideProps } from "../../../component/desktop/chat/next"

import { AppComponent } from "../../../component/desktop/layout/app"
import Head from "next/head"
import { SVGComponent } from "../../../component/desktop/chat/svg"
import { SidebarComponent } from "../../../component/desktop/layout/sidebar"
import { ThemeProvider } from "../../../component/desktop/theme"
import { NavigationbarComponent } from "../../../component/desktop/layout/navigationbar"
import { ContentComponent } from "../../../component/desktop/layout/content"
import { SettingsMenuComponent } from "../../../component/desktop/settings/sidebar"

export default ({ theme, query }) => {
    return (
        <>
            <Head>
                <title>ミュート</title>
            </Head>
            <SVGComponent />
            <ThemeProvider userTheme={null} defaultGlobalThemeName={theme}>
                <AppComponent>
                    <NavigationbarComponent />
                    <SidebarComponent>
                        <SettingsMenuComponent />
                    </SidebarComponent>
                    <ContentComponent>a</ContentComponent>
                </AppComponent>
            </ThemeProvider>
        </>
    )
}
