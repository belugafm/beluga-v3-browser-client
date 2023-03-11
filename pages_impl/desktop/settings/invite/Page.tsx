export { getServerSideProps } from "../../../../component/next"

import { AppComponent } from "../../../../component/desktop/layout/App"
import Head from "next/head"
import { SVGComponent } from "../../../../component/SVG"
import { SidebarComponent } from "../../../../component/desktop/layout/Sidebar"
import { ThemeProvider } from "../../../../component/Theme"
import { NavigationbarComponent } from "../../../../component/desktop/layout/Navigationbar"
import { ContentComponent } from "../../../../component/desktop/layout/Content"
import { SettingsMenuComponent } from "../Sidebar"

export default ({ theme, query }) => {
    return (
        <>
            <Head>
                <title>招待を作成</title>
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
