import { createContext, useState } from "react"

import { MessageObjectT } from "../../../api/object"

export type DeleteMessageModalActionT = {
    show: (message: MessageObjectT) => void
    hide: () => void
}

export const ModalContentType = {
    DeleteMessage: "DeleteMessage",
} as const

export type ModalStateT = {
    hidden: boolean
    message: MessageObjectT
}

export const useDeleteMessageModalState = (): [ModalStateT, DeleteMessageModalActionT] => {
    const [hidden, setHidden] = useState(true)
    const [message, setMessage] = useState<MessageObjectT>(null)

    return [
        { hidden, message },
        {
            show: (message: MessageObjectT) => {
                setMessage(message)
                setHidden(false)
                return false
            },
            hide: () => {
                setHidden(true)
                return false
            },
        },
    ]
}

export const DeleteMessageModalActionContext = createContext<DeleteMessageModalActionT>({
    show: null,
    hide: null,
})
