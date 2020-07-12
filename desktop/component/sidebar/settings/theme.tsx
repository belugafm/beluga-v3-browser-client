import { useTheme } from "../../theme"

export const ThemeSettingComponent = () => {
    const [theme, setTheme] = useTheme()
    const handleChange = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault()
        if (theme.global.current === theme.global.light) {
            setTheme("dark")
        } else if (theme.global.current === theme.global.dark) {
            setTheme("light")
        }
    }
    return (
        <>
            <a onClick={handleChange}>テーマを変更</a>
            <style jsx>{`
                a {
                    cursor: pointer;
                }
            `}</style>
        </>
    )
}
