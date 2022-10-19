import { MouseEvent, createContext, useState } from "react"
import { PageContextObjectT } from "../../chat/store/types/page_context"

export type ChannelMenuModalActionT = {
    show: (event: MouseEvent<HTMLButtonElement>) => void
    hide: () => void
    toggle: (event: MouseEvent<HTMLButtonElement>) => void
}

export type ChannelMenuModalStateT = {
    hidden: boolean
    left: number
    top: number
}

const findParentButtonElement = (target: HTMLElement) => {
    if (target.tagName.toLowerCase() == "button") {
        return target
    }
    while (target.parentNode) {
        // @ts-ignore
        target = target.parentNode
        if (target.tagName.toLowerCase() == "button") {
            return target
        }
    }
    return null
}

export const useChannelMenuModalState = (
    pageContext: PageContextObjectT
): [ChannelMenuModalStateT, ChannelMenuModalActionT] => {
    const [hidden, setHidden] = useState(true)
    const [top, setTop] = useState(0)
    const [left, setLeft] = useState(0)

    const show = (event: MouseEvent<HTMLButtonElement>) => {
        // @ts-ignore
        const targetNode = findParentButtonElement(event.target)
        if (targetNode == null) {
            setHidden(true)
            return
        }
        const rect: DOMRect = targetNode.getBoundingClientRect()
        const buttonHeight = 30
        const menuWidth = 272
        setHidden(false)
        setTop(rect.top + targetNode.clientHeight)
        // @ts-ignore
        setLeft(rect.left + targetNode.clientWidth / 2 - menuWidth / 2)
    }
    const hide = () => {
        setHidden(true)
    }

    return [
        { hidden, top, left },
        {
            show,
            hide,
            toggle: (event: MouseEvent<HTMLButtonElement>) => {
                if (hidden) {
                    show(event)
                } else {
                    hide()
                }
            },
        },
    ]
}

export const ChannelMenuModalActionContext = createContext<ChannelMenuModalActionT>({
    show: null,
    hide: null,
    toggle: null,
})

export const ChannelMenuModalStateContext = createContext(true)
