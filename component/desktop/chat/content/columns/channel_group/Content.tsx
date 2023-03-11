import React, { useContext, useState } from "react"
import { ThemeT, useTheme } from "../../../../../theme"

import { ContentStateT } from "../../../../../../state/chat/store/types/app_state"
import { DomainDataContext } from "../../../../../../state/chat/store/domain_data"
import { HeaderComponent } from "../../header"
import { PostboxComponent } from "../../../postbox/Postbox"
import { TooltipActionContext } from "../../../../../../state/component/tooltip"
import classnames from "classnames"
import { ChildChannelGroupComponent } from "./ChildChannelGroup"
import classNames from "classnames"
import { DescriptionComponent } from "./Description"

const getStyle = (theme: ThemeT) => {
    if (theme.global.current.light) {
        return {
            color: "#000",
            backgroundColor: "#ffffff",
            tabActiveColor: "#ffffff",
            tabHoverColor: "#000000",
            tabInactiveColor: "#555555",
            tabActiveBgColor: "#333333",
            tabHoverBgColor: "#e6e6e6",
            border: "1px solid rgba(0, 0, 0, 0.08)",
        }
    }
    if (theme.global.current.dark) {
        return {
            color: "#fcfcfc",
            tabActiveColor: "#000000",
            tabHoverColor: "#ffffff",
            tabInactiveColor: "#dcdcdc",
            tabActiveBgColor: "#ffffff",
            tabHoverBgColor: "#333333",
            backgroundColor: "rgba(30, 30, 30, 0.98)",
            border: "none",
        }
    }
    throw new Error()
}

export const ChannelGroupContentComponent = ({ content }: { content: ContentStateT }) => {
    const domainData = useContext(DomainDataContext)
    const tooltipAction = useContext(TooltipActionContext)
    const [theme] = useTheme()
    const [tabIndex, setTabIndex] = useState(0)
    if (content.context.channelGroupId == null) {
        return null
    }
    const channelGroup = domainData.channelGroups.get(content.context.channelGroupId)
    if (channelGroup == null) {
        return null
    }
    let parentChannelGroup = null
    if (channelGroup.parent_id) {
        parentChannelGroup = domainData.channelGroups.get(channelGroup.parent_id)
    }
    if (channelGroup == null) {
        return null
    }
    const childChannelGroups = channelGroup.child_channel_group_ids
        .map((channelGroupId) => domainData.channelGroups.get(channelGroupId))
        .filter((channelGroup) => channelGroup != null)
    const childChannelGroupsComponents = childChannelGroups.map((channelGroup, index) => {
        return <ChildChannelGroupComponent channelGroup={channelGroup} theme={theme} key={index} />
    })
    return (
        <>
            <div className="content">
                <div
                    className={classnames("block back-to-parent", {
                        hidden: parentChannelGroup == null,
                    })}>
                    <div className="block-content translucent back-to-parent">
                        <a
                            className="back-to-parent-link"
                            href={`/group/${parentChannelGroup?.unique_name}`}>
                            <svg className="back-arrow-svg">
                                <use href="#icon-direction-left"></use>
                            </svg>
                            <span>{parentChannelGroup?.name}</span>
                        </a>
                    </div>
                </div>
                <div
                    className={classnames("block cover-image-container", {
                        hidden: channelGroup.image_url == null,
                    })}>
                    <img className="cover-image" src={channelGroup.image_url} />
                </div>
                <div className="block tab-block">
                    <div className="block-content translucent">
                        <div className="header">
                            <HeaderComponent content={content} />
                            <div className="tab">
                                <a
                                    className={classnames("tab-item", {
                                        active: tabIndex == 0,
                                    })}
                                    href={`/group/${channelGroup.unique_name}`}>
                                    概要
                                </a>
                                <a
                                    className={classnames("tab-item", {
                                        active: tabIndex == 1,
                                    })}
                                    href={`/group/${channelGroup.unique_name}/find`}>
                                    見つける
                                </a>
                            </div>
                        </div>
                        <div className="description">
                            <DescriptionComponent text={channelGroup.description} theme={theme} />
                        </div>
                        <div
                            className={classnames("find-container", {
                                hidden: tabIndex != 1,
                            })}>
                            見つかる予定
                        </div>
                    </div>
                </div>
                <div
                    className={classNames("block child-channel-group-block", {
                        hidden: childChannelGroupsComponents.length == 0,
                    })}>
                    <h2>チャンネルグループ</h2>
                    <div className="child-channel-groups">{childChannelGroupsComponents}</div>
                </div>
            </div>
            <style jsx>{`
                .content {
                    flex: 1 1 auto;
                    overflow-x: hidden;
                    overflow-y: scroll;
                    padding: 16px;
                }
                .content::-webkit-scrollbar {
                    width: 0px;
                    height: 0px;
                }
                .content::-webkit-scrollbar-thumb {
                    border-radius: 10px;
                    background-color: gray;
                }
                .content::-webkit-scrollbar-track-piece {
                    background-clip: padding-box;
                    background-color: transparent;
                    border-color: transparent;
                }
                .block {
                    flex: 1 1 auto;
                    display: flex;
                }
                .block-content {
                    width: 100%;
                    min-height: 0;
                    display: flex;
                    flex-direction: column;
                    flex: 1 1 auto;
                    box-sizing: border-box;
                    position: relative;
                    overflow: hidden;
                    transition-duration: 0.2s;
                }
                .block:last-child .block-content {
                    margin-bottom: 0;
                }
                .cover-image-container {
                    flex: 0 0 auto;
                    min-height: 0;
                    padding: 4px 4px 0 4px;
                    margin-bottom: 20px;
                }
                .block.back-to-parent {
                    flex: 0 0 40px;
                }
                .block-content.back-to-parent {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    margin-bottom: 8px;
                }
                .back-to-parent-link {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    font-size: 15px;
                    line-height: 40px;
                    font-weight: bold;
                    text-decoration: none;
                }
                .back-to-parent-link:hover {
                    text-decoration: underline;
                }
                .back-arrow-svg {
                    width: 20px;
                    height: 20px;
                    margin-right: 5px;
                }
                .cover-image {
                    width: 100%;
                    border-radius: 16px;
                }
                .header {
                    flex: 0 0 auto;
                    z-index: 3;
                }
                .tab {
                    flex: 0 0 auto;
                    z-index: 3;
                    display: flex;
                    flex-direction: row;
                    border-bottom: 1px solid transparent;
                    font-size: 15px;
                    padding: 0 10px;
                }
                .tab-item {
                    text-decoration: none;
                    padding: 6px 16px;
                    margin: 0 10px -1px 0;
                    border-radius: 32px;
                }
                .description {
                    padding: 20px 10px;
                }
                .find-container {
                    padding: 20px;
                }
                .child-channel-group-block {
                    flex-direction: column;
                    padding: 0px;
                }
                .child-channel-group-block h2 {
                    font-size: 20px;
                    font-weight: bold;
                    padding: 0 10px;
                }
                .child-channel-groups {
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                }
                .hidden {
                    display: none;
                }
            `}</style>
            <style jsx>{`
                .content {
                    background-color: ${getStyle(theme)["backgroundColor"]};
                }
                .block {
                    color: ${getStyle(theme)["color"]};
                }
                .back-to-parent-link {
                    color: ${getStyle(theme)["color"]};
                }
                .tab-item {
                    color: ${getStyle(theme)["tabInactiveColor"]};
                }
                .tab-item:hover {
                    color: ${getStyle(theme)["tabHoverColor"]};
                    background-color: ${getStyle(theme)["tabHoverBgColor"]};
                }
                .tab-item.active {
                    color: ${getStyle(theme)["tabActiveColor"]};
                    background-color: ${getStyle(theme)["tabActiveBgColor"]};
                }
                .tab-item.active:hover {
                    background-color: ${getStyle(theme)["tabActiveBgColor"]};
                }
                .back-arrow-svg {
                    stroke: ${getStyle(theme)["color"]};
                }
            `}</style>
        </>
    )
}
