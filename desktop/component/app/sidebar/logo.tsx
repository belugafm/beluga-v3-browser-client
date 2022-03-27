import { useTheme } from "../../theme"

export const LogoSidebarComponent = () => {
    return (
        <>
            <div>良い感じのロゴ</div>
            <style jsx>{`
                div {
                    position: relative;
                    height: 80px;
                    margin-top: -24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    font-weight: 700;
                }
            `}</style>
        </>
    )
}
