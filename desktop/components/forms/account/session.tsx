import { SignupFormComponent } from "./signup"
import { SigninFormComponent } from "./signin"
import { useTheme } from "../../theme"
import classnames from "classnames"

function getInnerComponent(active: string) {
    if (active === "signup") {
        return <SignupFormComponent></SignupFormComponent>
    }
    if (active === "signin") {
        return <SigninFormComponent></SigninFormComponent>
    }
}

export const AccountSessionComponent = ({ active }: { active: string }) => {
    const [theme] = useTheme()
    const innerComponent = getInnerComponent(active)
    return (
        <div className="session">
            <div className={classnames("tab-menu", `active-${active}`)}>
                <ul>
                    <li>
                        <a className="signup" href="/signup">
                            新規登録
                        </a>
                    </li>
                    <li>
                        <a className="signin" href="/login">
                            ログイン
                        </a>
                    </li>
                </ul>
            </div>
            <div className="form">{innerComponent}</div>
            <style jsx>{`
                .session {
                    width: 500px;
                    margin: auto;
                    border-radius: 6px;
                    font-size: 15px;
                }
                .tab-menu {
                    display: flex;
                    flex-direction: row;
                }
                .tab-menu ul {
                    flex: 1 1 auto;
                    list-style-type: none;
                    display: inline-flex;
                    flex-direction: row;
                    margin: 0;
                    padding: 10px 40px 0 40px;
                    align-items: center;
                }
                .tab-menu li {
                    flex: 0 0 auto;
                    margin: 0 30px 0 0;
                    padding: 0;
                }
                .tab-menu a {
                    display: block;
                    text-decoration: none;
                    margin: 0;
                    padding: 0;
                    height: 40px;
                    line-height: 40px;
                    font-weight: bold;
                }
                .form {
                    padding: 40px;
                    margin: 0;
                }
            `}</style>
            <style jsx>{`
                .session {
                    background-color: ${theme.global.current
                        .backgroundSecondaryColor};
                    box-shadow: ${theme.global.current.boxShadow};
                    transition: background-color
                        ${theme.global.current.transitionDuration} linear 0s;
                }
                .tab-menu a {
                    color: ${theme.global.current.fontSecondaryColor};
                    transition: color ${theme.global.current.transitionDuration}
                            linear 0s,
                        border-bottom-color
                            ${theme.global.current.transitionDuration} linear 0s;
                }
                .tab-menu a:hover {
                    color: ${theme.global.current.fontPrimaryColor};
                }
                .tab-menu.active-signup a.signup {
                    color: ${theme.global.current.fontPrimaryColor};
                    border-bottom: 3px solid
                        ${theme.global.current.fontPrimaryColor};
                }
                .tab-menu.active-signin a.signin {
                    color: ${theme.global.current.fontPrimaryColor};
                    border-bottom: 3px solid
                        ${theme.global.current.fontPrimaryColor};
                }
                .tab-menu ul {
                    border-bottom: 1px solid
                        ${theme.global.current.borderPrimaryColor};
                    transition: border-bottom-color
                        ${theme.global.current.transitionDuration} linear 0s;
                }
            `}</style>
        </div>
    )
}
