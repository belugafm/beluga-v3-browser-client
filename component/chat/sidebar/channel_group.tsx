import { useContext } from "react"
import { ChannelGroupId, ChannelGroupObjectT } from "../../../api/object"
import { DomainDataContext } from "../../../state/chat/store/domain_data"
import { Themes, useTheme } from "../../theme"
import { Random } from "../message/avatar"

const getStyle = (theme: Themes) => {
    if (theme.global.current.light) {
        return {
            backgroundColor: "#ededed",
            hoverBackgroundColor: "#ededed",
            color: "#333333",
            hoverColor: "#000000",
        }
    }
    if (theme.global.current.dark) {
        return {
            backgroundColor: "#0c0c0c",
            hoverBackgroundColor: "#171717",
            color: "#7d7d7d",
            hoverColor: "#fff",
        }
    }
    throw new Error()
}

const CardWithoutImage = ({ channelGroup }: { channelGroup: ChannelGroupObjectT }) => {
    const [theme] = useTheme()
    return null
}

const ImageComponent = ({
    channelGroupId,
    imageUrl,
}: {
    channelGroupId: ChannelGroupId
    imageUrl: string | null
}) => {
    if (imageUrl != null) {
        return (
            <>
                <img src={`${imageUrl}:square`}></img>
                <style jsx>{`
                    img {
                        background-size: auto 100%;
                        background-position: 50% 50%;
                        mask: url('data:image/svg+xml;utf8,<svg preserveAspectRatio="none" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M 0, 100 C 0, 23 23, 0 100, 0 S 200, 23 200, 100 177, 200 100, 200 0, 177 0, 100" fill="white"></path></svg>');
                        mask-size: 100% 100%;
                        width: 50px;
                        height: 50px;
                    }
                `}</style>
            </>
        )
    }
    const gen = new Random(channelGroupId)
    const hue = 360 * gen.next()
    const sat = 50
    const lightness = 70
    return (
        <>
            <img />
            <style jsx>{`
                img {
                    width: 50px;
                    height: 50px;
                    mask: url('data:image/svg+xml;utf8,<svg preserveAspectRatio="none" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M 0, 100 C 0, 23 23, 0 100, 0 S 200, 23 200, 100 177, 200 100, 200 0, 177 0, 100" fill="white"></path></svg>');
                    mask-size: 100% 100%;
                    -webkit-mask-image: url('data:image/svg+xml;utf8,<svg preserveAspectRatio="none" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M 0, 100 C 0, 23 23, 0 100, 0 S 200, 23 200, 100 177, 200 100, 200 0, 177 0, 100" fill="white"></path></svg>');
                    border-radius: 0;
                    margin-top: 2px;
                    flex: 0 0 50px;
                }
            `}</style>
            <style jsx>{`
                img {
                    background-color: hsl(${hue}deg, ${sat}%, ${lightness}%);
                }
            `}</style>
        </>
    )
}

const CardWithImage = ({ channelGroup }: { channelGroup: ChannelGroupObjectT }) => {
    const [theme] = useTheme()
    return (
        <>
            <a className="card" href={`/group/${channelGroup.unique_name}`}>
                <div className="avatar-block">
                    <ImageComponent
                        channelGroupId={channelGroup.id}
                        imageUrl={channelGroup.image_url}
                    />
                </div>
                <div className="meta-block">
                    <div className="title-block">
                        <span>{channelGroup.name}</span>
                    </div>
                    <div className="stats-block">
                        <div className="message-count">
                            <svg className="icon">
                                <use href="#icon-chat"></use>
                            </svg>
                            <span className="value">{channelGroup.message_count}</span>
                        </div>
                    </div>
                </div>
            </a>
            <style jsx>{`
                .card {
                    flex: 0 0 auto;
                    height: 70px;
                    display: flex;
                    border-radius: 8px;
                    overflow: hidden;
                    flex-direction: row;
                    background-color: ${getStyle(theme)["backgroundColor"]};
                    color: ${getStyle(theme)["color"]};
                    text-decoration: none;
                    margin-bottom: 16px;
                    transition: 0.3s;
                }
                .card:hover {
                    transform: translateY(-3px);
                    background-color: ${getStyle(theme)["hoverBackgroundColor"]};
                    color: ${getStyle(theme)["hoverColor"]};
                }
                .avatar-block {
                    width: 80px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .title-block {
                    display: flex;
                    font-size: 16px;
                    font-weight: bold;
                    margin-top: 13px;
                }
                .icon {
                    width: 16px;
                    height: 16px;
                    fill: ${getStyle(theme)["color"]};
                    transition: 0.3s;
                }
                .card:hover .icon {
                    fill: ${getStyle(theme)["hoverColor"]};
                }
                .stats-block {
                    display: flex;
                    flex-direction: row;
                }
                .message-count {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                }
                .message-count .value {
                    font-size: 14px;
                    margin-left: 3px;
                }
            `}</style>
        </>
    )
}

export const ChannelGroupCardComponent = ({
    channelGroupId,
}: {
    channelGroupId: ChannelGroupId
}) => {
    const domainData = useContext(DomainDataContext)
    const channelGroup = domainData.channelGroups.get(channelGroupId)
    if (channelGroup == null) {
        return null
    }
    if (channelGroup.image_url) {
        return <CardWithImage channelGroup={channelGroup} />
    }
    return <CardWithoutImage channelGroup={channelGroup} />
}
