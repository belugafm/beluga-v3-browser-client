import {
    ChannelMenuModalActionT,
    ChannelMenuModalStateT,
} from "../../../state/component/model/channel_menu"
import React, { MouseEvent } from "react"

import { Themes } from "../../theme"
import classNames from "classnames"

const getStyle = (theme: Themes) => {
    if (theme.global.current.light) {
        return {
            color: "#000",
            hoverColor: "#fff",
            borderColor: "#d8dadc",
            backgroundColor: "#fff",
            hoverBackgroundColor: "#2a85ff",
            boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px;",
        }
    }
    if (theme.global.current.dark) {
        return {
            color: "#fff",
            hoverColor: "#fff",
            borderColor: "#282d32",
            backgroundColor: "#111315",
            hoverBackgroundColor: "#2a85ff",
            boxShadow: "rgba(0, 0, 0, 0.2) 0px 8px 24px;",
        }
    }
    throw new Error()
}

export const ChannelMenuModalComponent = ({
    state,
    action,
    theme,
    channelGroupId,
}: {
    state: ChannelMenuModalStateT
    action: ChannelMenuModalActionT
    theme: Themes
    channelGroupId: number
}) => {
    console.info("ChannelMenuModalComponent::render")
    const handleClickBackgroun = (event: MouseEvent<HTMLDivElement>) => {
        // @ts-ignore
        if (event.target.className.indexOf("hide-modal-on-click") >= 0) {
            event.preventDefault()
            action.hide()
            return false
        }
        return true
    }
    return (
        <>
            <div
                className={classNames("modal-container hide-modal-on-click", {
                    hidden: state.hidden,
                })}
                onClick={handleClickBackgroun}>
                <div className="inner">
                    <div className="menu">
                        <a href={`/channel/create?parent_channel_group_id=${channelGroupId}`}>
                            チャンネルを作成する
                        </a>
                        <a href={`/group/create?parent_id=${channelGroupId}`}>
                            チャンネルグループを作成する
                        </a>
                    </div>
                </div>
            </div>
            <style jsx>{`
                .modal-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: 100;
                    opacity: 1;
                    transition: 0.05s;
                    visibility: visible;
                }
                .modal-container.hidden {
                    visibility: hidden;
                    z-index: 0;
                    opacity: 0;
                }
                .inner {
                    position: fixed;
                    border-radius: 8px;
                    box-sizing: border-box;
                    border: 1px solid;
                    padding: 8px 0;
                }
                a {
                    display: block;
                    text-decoration: none;
                    padding: 6px 16px;
                    font-weight: 500;
                    font-size: 15px;
                }
            `}</style>
            <style jsx>{`
                .inner {
                    top: ${state.top}px;
                    left: ${state.left}px;
                    border-color: ${getStyle(theme)["borderColor"]};
                    background-color: ${getStyle(theme)["backgroundColor"]};
                    box-shadow: ${getStyle(theme)["boxShadow"]};
                }
                a {
                    color: ${getStyle(theme)["color"]};
                }
                a:hover {
                    color: ${getStyle(theme)["hoverColor"]};
                    background-color: ${getStyle(theme)["hoverBackgroundColor"]};
                }
            `}</style>
        </>
    )
}