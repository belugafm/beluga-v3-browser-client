import React from "react"
import { UserObjectT } from "../../../../api/object"

type PropsT = {
    user: UserObjectT
}

export class Random {
    x: number
    y: number
    z: number
    w: number
    constructor(seed: number) {
        seed ^= seed << 13
        seed ^= 2 >>> 17
        seed ^= seed << 5
        this.x = 123456789 ^ seed
        seed ^= seed << 13
        seed ^= 2 >>> 17
        seed ^= seed << 5
        this.y = 362436069 ^ seed
        seed ^= seed << 13
        seed ^= 2 >>> 17
        seed ^= seed << 5
        this.z = 521288629 ^ seed
        seed ^= seed << 13
        seed ^= 2 >>> 17
        seed ^= seed << 5
        this.w = 88675123 ^ seed
    }
    next() {
        let t
        t = this.x ^ (this.x << 11)
        this.x = this.y
        this.y = this.z
        this.z = this.w
        // >>>0 means 'cast to uint32'
        this.w = (this.w ^ (this.w >>> 19) ^ (t ^ (t >>> 8))) >>> 0
        return this.w / 0x100000000
    }
    integer(min: number, max: number) {
        const n = this.next()
        const r = Math.abs(n)
        return min + (r % (max + 1 - min))
    }
}

const DefaultAvatarComponent = ({ user }: PropsT) => {
    const gen = new Random(user.id)
    const hue = 360 * gen.next()
    const sat = 50
    const lightness = 70
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

const ProfileImageComponent = ({ user }: PropsT) => {
    return (
        <>
            <div className="avatar">
                <img src={user.profile_image_url} />
            </div>
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
                img {
                    width: 45px;
                    height: 45px;
                }
            `}</style>
        </>
    )
}

export const MessageAvatarComponent = React.memo(
    (props: PropsT) => {
        const { user } = props
        console.debug("MessageAvatarComponent::render", user.id, user.profile_image_url)
        if (user.profile_image_url == null) {
            return <DefaultAvatarComponent user={user} />
        }
        return <ProfileImageComponent user={user} />
    },
    (prevProps: PropsT, nextProps: PropsT) => {
        if (prevProps.user.profile_image_url !== nextProps.user.profile_image_url) {
            return false
        }
        return true
    }
)
