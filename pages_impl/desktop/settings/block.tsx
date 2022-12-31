export { getServerSideProps } from "../../../component/chat/next"

import { AppComponent } from "../../../component/layout/app"
import Head from "next/head"
import { SVGComponent } from "../../../component/chat/svg"
import { SidebarComponent } from "../../../component/layout/sidebar"
import { ThemeProvider } from "../../../component/theme"
import { NavigationbarComponent } from "../../../component/layout/navigationbar"
import { ContentComponent } from "../../../component/layout/content"
import { SettingsMenuComponent } from "../../../component/settings/sidebar"

export default ({ theme, query }) => {
    return (
        <>
            <Head>
                <title>ブロック</title>
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
