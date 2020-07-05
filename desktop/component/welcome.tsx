import React from "react"
import { useTheme } from "./theme"

export const WelcomeComponent = () => {
    const [theme] = useTheme()
    return (
        <div className="welcome">
            <div>Belugaへようこそ！</div>
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
                    background-color: ${theme.global.current
                        .backgroundSecondaryColor};
                }
            `}</style>
        </div>
    )
}
