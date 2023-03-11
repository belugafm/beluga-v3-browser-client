import { ThemeT } from "../../../../../theme"
import { ChannelGroupObjectT } from "../../../../../../api/object"
import { Random } from "../../../message/ProfileImage"

export const CoverImageComponent = ({ channelGroup }: { channelGroup: ChannelGroupObjectT }) => {
    if (channelGroup.image_url) {
        return (
            <>
                <div className="img"></div>
                <style jsx>{`
                    .img {
                        width: 100%;
                        height: 100px;
                        background-image: url(${channelGroup.image_url});
                        background-size: 100% auto;
                        background-position: 50%;
                    }
                `}</style>
            </>
        )
    }
    const gen = new Random(channelGroup.id)
    const hue = 360 * gen.next()
    const sat = 50
    const lightness = 70
    return (
        <>
            <div className="image"></div>
            <style jsx>{`
                .image {
                    width: 100%;
                    height: 300px;
                    background-color: hsl(${hue}deg, ${sat}%, ${lightness}%);
                }
            `}</style>
        </>
    )
}
