import React from "react"
import { useLoggedInUser } from "../state/session"
import { useTheme } from "./theme"

const AlreadyLoggedInMessageComponent = () => {
    const { loggedInUser, authenticityToken } = useLoggedInUser()
    console.log(loggedInUser)
    console.log(authenticityToken)
    if (loggedInUser && authenticityToken) {
        return (
            <div>
                <p>{`name: ${loggedInUser.name}`}</p>
                <p>{`trust_level: ${loggedInUser.trust_level}`}</p>
                <p>{`token: ${authenticityToken}`}</p>
            </div>
        )
    } else {
        return null
    }
}

export const WelcomeComponent = () => {
    const [theme] = useTheme()
    return (
        <div className="welcome">
            <div>Belugaへようこそ！</div>
            <AlreadyLoggedInMessageComponent />
            <div>
                <ul>
                    <li>
                        <a href="/home">ホーム</a>
                    </li>
                </ul>
            </div>
            <style jsx>{`
                .welcome {
                    width: 500px;
                    margin: auto;
                    border-radius: 6px;
                    font-size: 15px;
                }
            `}</style>
            <style jsx>{`
                .welcome {
                    box-shadow: ${theme.global.current.boxShadow};
                    background-color: ${theme.global.current.backgroundSecondaryColor};
                }
            `}</style>
        </div>
    )
}
