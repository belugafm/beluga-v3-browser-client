import {
    DeleteMessageModalActionContext,
    useDeleteMessageModalState,
} from "../../../state/component/model/modal"

import { DeleteMessageModalComponent } from "./delete_message"
import React from "react"

const DeleteMessageModalActionContextProvider = ({ children }) => {
    const [state, action] = useDeleteMessageModalState()
    return (
        <DeleteMessageModalActionContext.Provider value={action}>
            {children}
            <DeleteMessageModalComponent
                hidden={state.hidden}
                message={state.message}
                modalAction={action}
            />
        </DeleteMessageModalActionContext.Provider>
    )
}

export const ModalContextProvider = ({ children }) => {
    return (
        <DeleteMessageModalActionContextProvider>
            {children}
        </DeleteMessageModalActionContextProvider>
    )
}
