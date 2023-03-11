import { ThemeT } from "../../../../../Theme"
import { ChannelGroupObjectT } from "../../../../../../api/object"
import { CoverImageComponent } from "./CoverImage"

const getStyle = (theme: ThemeT) => {
    if (theme.global.current.light) {
        return {
            color: "#000",
            numMessageColor: "#2980b9",
            numMemberColor: "#27ae60",
            primaryBgColor: "#ffffff",
            secondaryBgColor: "#f7f7f7",
            borderColor: "#e0e0e0",
        }
    }
    if (theme.global.current.dark) {
        return {
            color: "#fcfcfc",
            numMessageColor: "#2980b9",
            numMemberColor: "#27ae60",
            primaryBgColor: "rgba(20, 20, 20, 0.98)",
            secondaryBgColor: "rgba(30, 30, 30, 0.98)",
            borderColor: "none",
        }
    }
    throw new Error()
}

export const ChildChannelGroupComponent = ({
    channelGroup,
    theme,
}: {
    channelGroup: ChannelGroupObjectT
    theme: ThemeT
}) => {
    return (
        <>
            <div className="container">
                <div className="channel-group">
                    <div className="cover-image">
                        <CoverImageComponent channelGroup={channelGroup} />
                    </div>
                    <div className="metadata">
                        <a className="name" href={`/group/${channelGroup.unique_name}`}>
                            {channelGroup.name}
                        </a>
                        <div className="description">{channelGroup.description}</div>
                        <div className="stats-block">
                            <div className="stats num-message">
                                <svg className="stats-category-icon num-message">
                                    <use href="#icon-chat"></use>
                                </svg>
                                <div className="stats-number">{99999}</div>
                            </div>
                            <div className="stats num-member">
                                <svg className="stats-category-icon num-member">
                                    <use href="#icon-two-users"></use>
                                </svg>
                                <div className="stats-number">{99999}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx>{`
                .container {
                    flex: 1 1 50%;
                    min-width: 50%;
                    max-width: 50%;
                    height: 305px;
                    box-sizing: border-box;
                    padding: 10px;
                    position: relative;
                }
                .channel-group {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    height: 100%;
                    border-radius: 10px;
                    box-sizing: border-box;
                    background-color: ${getStyle(theme)["primaryBgColor"]};
                    border: 1px solid ${getStyle(theme)["borderColor"]};
                }
                .cover-image {
                    flex: 0 0 100px;
                    width: 100%;
                    overflow: hidden;
                    border-radius: 10px 10px 0 0;
                }
                .metadata {
                    flex: 1 1 auto;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    box-sizing: border-box;
                }
                .name {
                    padding: 0;
                    margin: 0;
                    font-size: 18px;
                    margin-bottom: 10px;
                    font-weight: bold;
                    text-decoration: none;
                    color: ${getStyle(theme)["color"]};
                }
                .name:hover {
                    text-decoration: underline;
                }
                .description {
                    flex: 1 1 auto;
                    font-size: 16px;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    width: 100%;
                    overflow: hidden;
                    margin-bottom: 20px;
                }
                .stats-block {
                    flex: 0 0 auto;
                    border-radius: 5px;
                    display: flex;
                    flex-direction: row;
                    background-color: ${getStyle(theme)["secondaryBgColor"]};
                    position: relative;
                    bottom: 0;
                }
                .stats {
                    width: 50%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 10px;
                    box-sizing: border-box;
                }
                .stats-number {
                    font-size: 16px;
                }
                .stats-category-icon {
                    width: 18px;
                    height: 18px;
                    margin-bottom: 5px;
                }
                .stats-category-icon.num-message {
                    fill: ${getStyle(theme)["numMessageColor"]};
                }
                .stats-category-icon.num-member {
                    stroke: ${getStyle(theme)["numMemberColor"]};
                }
            `}</style>
        </>
    )
}
