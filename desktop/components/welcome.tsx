import React from "react"
import { useTheme } from "./theme"

export const WelcomeComponent = () => {
    const [theme] = useTheme()
    return (
        <div className="welcome">
            <div>Belugaへようこそ！</div>
            <div>ここに良い感じのガイダンス的なやつを入れる</div>
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
