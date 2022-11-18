import { MessageObjectT } from "../../../api/object"
import React from "react"
import { Themes } from "../../theme"
import { Random } from "./avatar"

const getStyle = (theme: Themes) => {
    if (theme.global.current.light) {
        return {
            fill: "#fec52e",
        }
    }
    if (theme.global.current.dark) {
        return {
            fill: "#fec52e",
        }
    }
    throw new Error()
}

export const FavoritesComponent = ({
    message,
    theme,
}: {
    message: MessageObjectT
    theme: Themes
}) => {
    if (message.favorite_count == 0) {
        return null
    }
    const userDomList = []
    message.entities.favorited_users.forEach((user, index) => {
        const gen = new Random(user.id)
        const hue = 360 * gen.next()
        const sat = 50
        const lightness = 70
        userDomList.push(
            <div className="user" key={index}>
                <a href={`/user/${user.name}`}>
                    <img src={user.profile_image_url} />
                </a>
                <style jsx>{`
                    .user {
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        width: 20px;
                        height: 20px;
                        margin-right: 4px;
                    }
                    a {
                        display: block;
                        width: 100%;
                        height: 100%;
                    }
                    img {
                        width: 100%;
                        height: 100%;
                        mask: url('data:image/svg+xml;utf8,<svg preserveAspectRatio="none" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M 0, 100 C 0, 23 23, 0 100, 0 S 200, 23 200, 100 177, 200 100, 200 0, 177 0, 100" fill="white"></path></svg>');
                        mask-size: 100% 100%;
                        -webkit-mask-image: url('data:image/svg+xml;utf8,<svg preserveAspectRatio="none" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M 0, 100 C 0, 23 23, 0 100, 0 S 200, 23 200, 100 177, 200 100, 200 0, 177 0, 100" fill="white"></path></svg>');
                        background-color: hsl(${hue}deg, ${sat}%, ${lightness}%);
                    }
                `}</style>
            </div>
        )
    })
    return (
        <div className="favorites">
            <div className="users-area">{userDomList}</div>
            <div className="count-area">
                <span className="count">{message.favorite_count}</span>
                <span className="description">ふぁぼ</span>
            </div>
            <style jsx>{`
                .favorites {
                    display: flex;
                    flex-direction: row;
                    margin: 6px 0;
                }
                .users-area {
                    flex: 0 1 auto;
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    align-items: center;
                }
                .count-area {
                    flex: 1 1 auto;
                    display: flex;
                    flex-direction: row;
                    min-width: 60px;
                    padding-left: 5px;
                    align-items: center;
                    font-size: 12px;
                }
                .count {
                    font-weight: 700;
                }
            `}</style>
        </div>
    )
}
