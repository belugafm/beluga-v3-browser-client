import { createContext, useState } from "react"

export type DrawerActionT = {
    show: () => void
    hide: () => void
    toggle: () => void
}

export type DrawerStateT = {
    hidden: boolean
    left: string
}

const LeftCSSValue = {
    Hidden: "-90dvw",
    Visible: "0",
} as const

export const useDrawerState = (): [DrawerStateT, DrawerActionT] => {
    const [hidden, setHidden] = useState(true)
    const [left, setLeft] = useState<typeof LeftCSSValue[keyof typeof LeftCSSValue]>(
        LeftCSSValue.Hidden
    )

    const show = () => {
        setHidden(false)
        setLeft(LeftCSSValue.Visible)
    }
    const hide = () => {
        setHidden(true)
        setLeft(LeftCSSValue.Hidden)
    }
    const toggle = () => {
        if (hidden) {
            show()
        } else {
            hide()
        }
    }

    return [
        { hidden, left },
        {
            show,
            hide,
            toggle,
        },
    ]
}

export const DrawerActionContext = createContext<DrawerActionT>({
    show: null,
    hide: null,
    toggle: null,
})

export const DrawerStateContext = createContext<DrawerStateT>({
    hidden: true,
    left: LeftCSSValue.Hidden,
})
