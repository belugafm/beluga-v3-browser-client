import { useCallback, useRef } from "react"
import { postFormData } from "../../../../api/fetch"

export const ProfileImageComponent = () => {
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
