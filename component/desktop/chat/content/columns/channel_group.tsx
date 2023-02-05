import React, { useContext, useState } from "react"
import { ThemeT, useTheme } from "../../../../theme"

import { ContentStateT } from "../../../../../state/chat/store/types/app_state"
import { DomainDataContext } from "../../../../../state/chat/store/domain_data"
import { HeaderComponent } from "../header"
import { PostboxComponent } from "../../postbox"
import { TooltipActionContext } from "../../../../../state/component/tooltip"
import classnames from "classnames"
import { TimelineComponent } from "../timeline"

const getStyleForTheme = (theme: ThemeT) => {
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
            </div>
            <style jsx>{`
                .content {
                    flex: 1 1 auto;
                    display: flex;
                    flex-direction: column;
                    padding: 16px;
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
                    margin-bottom: 16px;
                }
                .block:last-child .block-content {
                    margin-bottom: 0;
                }
                .cover-image-container {
                    flex: 0 0 auto;
                    min-height: 0;
                    padding: 4px;
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
                .tab-block {
                    height: 0;
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
                    padding: 20px 0 10px 0;
                }
                .hidden {
                    display: none;
                }
            `}</style>
            <style jsx>{`
                .content {
                    background-color: ${getStyleForTheme(theme)["backgroundColor"]};
                }
                .block {
                    color: ${getStyleForTheme(theme)["color"]};
                }
                .back-to-parent-link {
                    color: ${getStyleForTheme(theme)["color"]};
                }
                .tab-item {
                    color: ${getStyleForTheme(theme)["tabInactiveColor"]};
                }
                .tab-item:hover {
                    color: ${getStyleForTheme(theme)["tabHoverColor"]};
                    background-color: ${getStyleForTheme(theme)["tabHoverBgColor"]};
                }
                .tab-item.active {
                    color: ${getStyleForTheme(theme)["tabActiveColor"]};
                    background-color: ${getStyleForTheme(theme)["tabActiveBgColor"]};
                }
                .tab-item.active:hover {
                    background-color: ${getStyleForTheme(theme)["tabActiveBgColor"]};
                }
                .back-arrow-svg {
                    stroke: ${getStyleForTheme(theme)["color"]};
                }
            `}</style>
        </>
    )
}
