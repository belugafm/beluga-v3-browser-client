import React from "react"
import { swrGetLoggedInUser } from "../../../swr/session"

const AlreadyLoggedInMessageComponent = () => {
    const { loggedInUser, authenticityToken } = swrGetLoggedInUser()
    console.log(loggedInUser)
    console.log(authenticityToken)
    if (loggedInUser && authenticityToken) {
        return (
            <div>
                <p>{`name: ${loggedInUser.name}`}</p>
                <p>{`trust_level: ${loggedInUser.trust_level}`}</p>
            </div>
        )
    } else {
        return null
    }
}

export const WelcomeComponent = () => {
    return (
        <div className="welcome">
            <div>Belugaへようこそ！</div>
            <AlreadyLoggedInMessageComponent />
            <div>
                <ul>
                    <li>
                        <a href="/group/global">パブリックタイムライン</a>
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
        </div>
    )
}
