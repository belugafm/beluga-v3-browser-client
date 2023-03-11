import { useTheme } from "../../../theme"

export const SidebarThemeComponent = () => {
    const [theme, setTheme] = useTheme()
    return (
        <>
            <button
                onClick={() => {
                    setTheme(theme.global.current.light ? "dark" : "light")
                    return false
                }}>
                テーマ変更
            </button>
        </>
    )
}
