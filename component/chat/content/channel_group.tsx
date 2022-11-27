import React, { useContext, useState } from "react"
import { Themes, useTheme } from "../../theme"

import { ContentStateT } from "../../../state/chat/store/types/app_state"
import { DomainDataContext } from "../../../state/chat/store/domain_data"
import { HeaderComponent } from "./header"
import { PostboxComponent } from "../postbox"
import { TooltipActionContext } from "../../../state/component/tooltip"
import classnames from "classnames"
import { TimelineComponent } from "./timeline"

const getStyleForTheme = (theme: Themes) => {
    if (theme.global.current.light) {
        return {
            color: "#000",
            backgroundColor: "#fff",
            tabActiveColor: "#111111",
            tabInactiveColor: "#555555",
            tabActiveBorderColor: "#000000",
            tabHoverBorderColor: "#999999",
            tabBorderColor: "#dddddd",
            dropShadow: "drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.05))",
        }
    }
    if (theme.global.current.dark) {
        return {
            color: "#fcfcfc",
            tabActiveColor: "#fcfcfc",
            tabInactiveColor: "#dcdcdc",
            tabActiveBorderColor: "#ffffff",
            tabHoverBorderColor: "#787878",
            tabBorderColor: "#373737",
            backgroundColor: "rgba(30, 30, 30, 0.98)",
            dropShadow: "none",
        }
    }
    throw new Error()
}

export const ChannelGroupContentComponent = ({ content }: { content: ContentStateT }) => {
    console.debug("ChannelGroupContentComponent::render")
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
    return (
        <>
            <div
                className={classnames("content-container back-to-parent", {
                    hidden: parentChannelGroup == null,
                })}>
                <div className="content translucent back-to-parent">
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
                className={classnames("content-container cover-image-container", {
                    hidden: channelGroup.image_url == null,
                })}>
                <img className="cover-image" src={channelGroup.image_url} />
            </div>
            <div className="content-container">
                <div className="content translucent">
                    <div className="header">
                        <HeaderComponent content={content} />
                        <div className="tab">
                            <a
                                className={classnames("tab-item", {
                                    active: tabIndex == 0,
                                })}
                                href="#description"
                                onClick={(e) => {
                                    e.preventDefault()
                                    setTabIndex(0)
                                }}>
                                概要
                            </a>
                            <a
                                className={classnames("tab-item", {
                                    active: tabIndex == 1,
                                })}
                                href="#timeline"
                                onClick={(e) => {
                                    e.preventDefault()
                                    setTabIndex(1)
                                }}>
                                タイムライン
                            </a>
                        </div>
                    </div>
                    <div
                        className={classnames("desctiption-container", {
                            hidden: tabIndex != 0,
                        })}>
                        <div className="description">{channelGroup.description}</div>
                    </div>
                    <div
                        className={classnames("timeline-container", {
                            hidden: tabIndex != 1,
                        })}>
                        <TimelineComponent content={content} />
                    </div>
                    <div className="postbox">
                        <PostboxComponent content={content} tooltipAction={tooltipAction} />
                    </div>
                </div>
            </div>
            <style jsx>{`
                .content-container {
                    flex: 1 1 auto;
                    padding: 8px;
                    display: flex;
                    min-height: 0;
                }
                .content {
                    width: 100%;
                    min-height: 0;
                    display: flex;
                    flex-direction: column;
                    flex: 1 1 auto;
                    box-sizing: border-box;
                    position: relative;
                    overflow: hidden;
                    border-radius: 8px;
                }
                .cover-image-container {
                    flex: 0 0 auto;
                    min-height: 0;
                }
                .content-container.back-to-parent {
                    flex: 0 0 40px;
                }
                .content.back-to-parent {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding: 0 10px;
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
                    border-radius: 8px;
                    width: 100%;
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
                    padding: 0 10px 10px 10px;
                    margin: 0 10px -1px 0;
                    border-bottom: 2px solid transparent;
                }
                .postbox {
                    flex: 0 0 auto;
                    z-index: 2;
                }
                .desctiption-container {
                    padding: 20px;
                }
                .timeline-container {
                    display: flex;
                    flex-direction: column;
                    flex: 1 1 auto;
                    position: relative;
                    overflow: hidden;
                }
                .hidden {
                    display: none;
                }
            `}</style>
            <style jsx>{`
                .content-container {
                    color: ${getStyleForTheme(theme)["color"]};
                    filter: ${getStyleForTheme(theme)["dropShadow"]};
                }
                .content {
                    background-color: ${getStyleForTheme(theme)["backgroundColor"]};
                }
                .back-to-parent-link {
                    color: ${getStyleForTheme(theme)["color"]};
                }
                .tab-item {
                    color: ${getStyleForTheme(theme)["tabInactiveColor"]};
                }
                .tab-item.active {
                    color: ${getStyleForTheme(theme)["tabActiveColor"]};
                    border-color: ${getStyleForTheme(theme)["tabActiveBorderColor"]};
                }
                .tab-item:hover {
                    border-color: ${getStyleForTheme(theme)["tabHoverBorderColor"]};
                }
                .tab-item.active:hover {
                    border-color: ${getStyleForTheme(theme)["tabActiveBorderColor"]};
                }
                .tab {
                    border-color: ${getStyleForTheme(theme)["tabBorderColor"]};
                }
                .back-arrow-svg {
                    stroke: ${getStyleForTheme(theme)["color"]};
                }
            `}</style>
        </>
    )
}
