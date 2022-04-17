import { createContext, useState } from "react"

export type TooltipActionT = {
    show: (event: MouseEvent, text: string) => void
    hide: () => void
}

export type TooltipStateT = {
    hidden: boolean
    left: number
    top: number
    text: string
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

export const useTooltipState = (): [TooltipStateT, TooltipActionT] => {
    const [hidden, setHidden] = useState(true)
    const [top, setTop] = useState(0)
    const [left, setLeft] = useState(0)
    const [text, setText] = useState("")

    return [
        { hidden, top, left, text },
        {
            show: (event: MouseEvent, text: string) => {
                // @ts-ignore
                console.dir(event.target)
                const targetNode = findParentButtonElement(event.target)
                if (targetNode == null) {
                    setHidden(true)
                    return
                }
                const rect: DOMRect = targetNode.getBoundingClientRect()
                const tooltipWidth = 300
                const tooltipHeight = 42
                setText(text)
                setHidden(false)
                setTop(rect.top - tooltipHeight)
                // @ts-ignore
                setLeft(rect.left + targetNode.clientWidth / 2 - tooltipWidth / 2)
            },
            hide: () => {
                setHidden(true)
            },
        },
    ]
}

export const TooltipActionContext = createContext<TooltipActionT>({
    show: null,
    hide: null,
})
