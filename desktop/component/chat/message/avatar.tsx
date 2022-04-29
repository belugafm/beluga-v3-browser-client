import React from "react"
import { UserObjectT } from "../../../api/object"

type PropsT = {
    user: UserObjectT
}
class Random {
    x: number
    y: number
    z: number
    w: number
    constructor(seed: number) {
        this.x = 123456789
        this.y = 362436069
        this.z = 521288629
        this.w = seed
    }

    next(min: number, max: number) {
        let t
        t = this.x ^ (this.x << 11)
        this.x = this.y
        this.y = this.z
        this.z = this.w
        const n = (this.w = this.w ^ (this.w >>> 19) ^ (t ^ (t >>> 8)))
        const r = Math.abs(n)
        return min + (r % (max + 1 - min))
    }
}
const DefaultAvatarComponent = ({ user }: PropsT) => {
    const gen = new Random(user.id)
    const hue = gen.next(0, 360)
    const sat = 60
    const lightness = 60
    return (
        <>
            <div className="avatar"></div>
            <style jsx>{`
                .avatar {
                    width: 45px;
                    height: 45px;
                    mask: url('data:image/svg+xml;utf8,<svg preserveAspectRatio="none" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M 0, 100 C 0, 23 23, 0 100, 0 S 200, 23 200, 100 177, 200 100, 200 0, 177 0, 100" fill="white"></path></svg>');
                    mask-size: 100% 100%;
                    -webkit-mask-image: url('data:image/svg+xml;utf8,<svg preserveAspectRatio="none" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M 0, 100 C 0, 23 23, 0 100, 0 S 200, 23 200, 100 177, 200 100, 200 0, 177 0, 100" fill="white"></path></svg>');
                    border-radius: 0;
                    margin-top: 2px;
                }
            `}</style>
            <style jsx>{`
                .avatar {
                    background-color: hsl(${hue}deg, ${sat}%, ${lightness}%);
                }
            `}</style>
        </>
    )
}

export const MessageAvatarComponent = React.memo(
    (props: PropsT) => {
        const { user } = props
        console.info("MessageAvatarComponent::render", user.profile_image_url)
        if (user.profile_image_url == null) {
            return <DefaultAvatarComponent user={user} />
        }
        return <DefaultAvatarComponent user={user} />
    },
    (prevProps: PropsT, nextProps: PropsT) => {
        if (prevProps.user.profile_image_url !== nextProps.user.profile_image_url) {
            return false
        }
        return true
    }
)
