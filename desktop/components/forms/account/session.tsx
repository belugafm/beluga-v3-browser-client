import { SignupFormComponent } from "../../signup"
import { useTheme } from "../../theme"

function getInnerComponent(active: string) {
    if (active === "signup") {
        return <SignupFormComponent></SignupFormComponent>
    }
}

export const AccountSessionComponent = ({ active }: { active: string }) => {
    const [theme] = useTheme()
    const innerComponent = getInnerComponent(active)
    return (
        <div className="session">
            <div className="tab-menu">
                <ul>
                    <li>
                        <a href="/signup">新規登録</a>
                    </li>
                    <li>
                        <a href="/login">ログイン</a>
                    </li>
                </ul>
            </div>
            <div className="form">{innerComponent}</div>
            <style jsx>{`
                .session {
                    width: 500px;
                    margin: auto;
                }
            `}</style>
            <style jsx>{`
                .session {
                    background-color: ${theme.global.current
                        .backgroundSecondaryColor};
                }
            `}</style>
        </div>
    )
}
