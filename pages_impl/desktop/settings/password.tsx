export { getServerSideProps } from "../../../component/next"

import { AppComponent } from "../../../component/desktop/layout/app"
import Head from "next/head"
import { SVGComponent } from "../../../component/svg"
import { SidebarComponent } from "../../../component/desktop/layout/sidebar"
import { ThemeProvider } from "../../../component/theme"
import { NavigationbarComponent } from "../../../component/desktop/layout/navigationbar"
import { ContentComponent } from "../../../component/desktop/layout/content"
import { SettingsMenuComponent } from "../../../component/desktop/settings/sidebar"

export default ({ theme, query }) => {
    return (
        <>
            <Head>
                <title>パスワード</title>
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
