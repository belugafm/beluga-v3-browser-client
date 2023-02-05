import React, { MouseEvent, useState } from "react"

import { ThemeT } from "../../../theme"
import classnames from "classnames"
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
                setTop(sidebarRect.height / 2 - 80)
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

export const ChannelDescriptionModalComponent = (props: ChannelDescriptionModalStateT) => {
    return (
        <>
            <div
                id="channel-description-modal"
                className={classnames("modal-container", {
                    hidden: props.hidden,
                })}>
                <div className="menu">
                    <p>Belugaではチャンネルと呼ばれる専用の場所に投稿します。</p>
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
                    background-color: rgba(13, 13, 13, 0.9);
                    backdrop-filter: blur(50px) saturate(180%);
                    border-radius: 10px;
                    opacity: 1;
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
                    background-color: rgb(13, 13, 13);
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
