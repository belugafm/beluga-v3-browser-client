export { getServerSideProps } from "../../../component/chat/next"

import { AppComponent } from "../../../component/layout/app"
import Head from "next/head"
import { SVGComponent } from "../../../component/chat/svg"
import { SidebarComponent } from "../../../component/layout/sidebar"
import { ThemeProvider } from "../../../component/theme"
import { NavigationbarComponent } from "../../../component/layout/navigationbar"
import { ContentComponent } from "../../../component/layout/content"
import { SettingsMenuComponent } from "../../../component/settings/sidebar"
import { useCallback, useRef } from "react"
import { postFormData } from "../../../api/fetch"

const ProfileImageComponent = () => {
    const fileInputRef = useRef(null)
    const onClickUpload = useCallback(
        (e) => {
            e.preventDefault()
            fileInputRef.current.value = ""
            fileInputRef.current.click()
        },
        [fileInputRef]
    )
    const handleUploadMedia = async (e) => {
        const files = e.target.files
        if (files.length == 0) {
            alert("ファイルを選択してください")
            fileInputRef.current.value = ""
            return
        }
        const file = files[0]
        var formData = new FormData()
        formData.append("file", file)
        const result = await postFormData("account/update_profile_image", formData)
        if (result.file == null) {
            alert("問題が発生したためアップロードできませんでした")
            fileInputRef.current.value = ""
            return
        }
        const path = result.file.path
        alert("変更しました")
        fileInputRef.current.value = ""
    }
    return (
        <>
            <p>プロフィール画像の変更</p>
            <input type="file" ref={fileInputRef} onChange={handleUploadMedia} multiple />
        </>
    )
}
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
