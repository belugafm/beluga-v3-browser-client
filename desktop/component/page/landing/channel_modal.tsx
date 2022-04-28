import React, { MouseEvent, useState } from "react"

import { Themes } from "../../theme"
import classNames from "classnames"
import { createContext } from "react"

export type ChannelDescriptionModalActionT = {
    show: (event: MouseEvent<HTMLDivElement>) => void
    hide: () => void
}

export type ChannelDescriptionModalStateT = {
    hidden: boolean
    left: number
    top: number
}

const findSidebar = (target: HTMLDivElement): HTMLDivElement => {
    if (target.className.indexOf("sidebar-block") >= 0) {
        return target
    }
    while (target.parentNode) {
        // @ts-ignore
        target = target.parentNode
        if (target.className.indexOf("sidebar-block") >= 0) {
            return target
        }
    }
    return null
}

export const useChannelDescriptionModalState = (): [
    ChannelDescriptionModalStateT,
    ChannelDescriptionModalActionT
] => {
    const [hidden, setHidden] = useState(true)
    const [top, setTop] = useState(0)
    const [left, setLeft] = useState(0)

    return [
        { hidden, top, left },
        {
            show: (event: MouseEvent<HTMLDivElement>) => {
                // @ts-ignore
                const targetNode = findSidebar(event.target)
                if (targetNode == null) {
                    return setHidden(true)
                }
                const modalNode = document.getElementById("channel-description-modal")
                const modalRect: DOMRect = modalNode.getBoundingClientRect()
                // @ts-ignore
                const sidebarRect: DOMRect = targetNode.getBoundingClientRect()
                setTop(sidebarRect.top)
                setLeft(sidebarRect.left - modalRect.width - 15)
                setHidden(false)
            },
            hide: () => {
                setHidden(true)
            },
        },
    ]
}

export const ChannelDescriptionModalActionContext = createContext<ChannelDescriptionModalActionT>({
    show: null,
    hide: null,
})

export const ChannelDescriptionModalStateContext = createContext(true)

const getStyle = (theme: Themes) => {
    if (theme.global.current.light) {
        return {
            color: "#000",
            hoverColor: "#000",
            borderColor: "#d8dadc",
            backgroundColor: "#fff",
            hoverBackgroundColor: "#f4f4f4",
            boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px;",
        }
    }
    if (theme.global.current.dark) {
        return {
            color: "#fff",
            hoverColor: "#fff",
            borderColor: "#282d32",
            backgroundColor: "#111315",
            hoverBackgroundColor: "#2a2d32",
            boxShadow: "rgba(0, 0, 0, 0.2) 0px 8px 24px;",
        }
    }
    throw new Error()
}

export const ChannelDescriptionModalComponent = (props: ChannelDescriptionModalStateT) => {
    return (
        <>
            <div
                id="channel-description-modal"
                className={classNames("modal-container", {
                    hidden: props.hidden,
                })}>
                <div className="menu">
                    <p>Belugaでは、チャンネルと呼ばれる専用の場所に投稿します。</p>
                    <p>
                        みんなが集まる雑談用のチャンネルを作ったり、自分専用のチャンネルを作ることもできます。
                    </p>
                </div>
                <div className="triangle"></div>
            </div>
            <style jsx>{`
                .modal-container {
                    position: fixed;
                    z-index: 100;
                    transition: opacity 0.1s;
                    visibility: visible;
                    border-radius: 12px;
                    box-sizing: border-box;
                    padding: 24px;
                    width: 300px;
                    background-color: white;
                    border-radius: 10px;
                    opacity: 1;
                    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
                }
                .modal-container.hidden {
                    z-index: 0;
                    opacity: 0;
                }
                a {
                    display: block;
                    text-decoration: none;
                    padding: 8px 16px;
                    font-weight: 500;
                    font-size: 15px;
                    border-radius: 8px;
                    margin: 4px 0;
                    transition: background-color 0.05s;
                }
                p {
                    margin: 0;
                    padding: 0;
                    line-height: 1.5em;
                    font-size: 15px;
                }
                .triangle {
                    position: absolute;
                    width: 20px;
                    height: 20px;
                    background-color: white;
                    transform: rotate(45deg);
                    top: calc(50% - 10px);
                    right: -10px;
                }
            `}</style>
            <style jsx>{`
                .modal-container {
                    top: ${props.top}px;
                    left: ${props.left}px;
                }
            `}</style>
        </>
    )
}
