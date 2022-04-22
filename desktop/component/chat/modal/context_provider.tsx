import * as reducers from "../../../state/chat/reducer_method"

import {
    DeleteMessageModalActionContext,
    useDeleteMessageModalState,
} from "../../../state/component/model/modal"

import { DeleteMessageModalComponent } from "./delete_message"
import { MessageObjectT } from "../../../api/object"
import React from "react"
import { ReducerContext } from "../../../state/chat/store/types/reducer"
import { useContext } from "react"
import { useTheme } from "../../theme"

const DeleteMessageModalActionContextProvider = ({ children }) => {
    const [state, action] = useDeleteMessageModalState()
    const [theme] = useTheme()
    const { reducer } = useContext(ReducerContext)
    const deleteMessage = (message: MessageObjectT) => {
        reducer(reducers.domainData.message.delete, {
            messageId: message.id,
        })
    }
    return (
        <DeleteMessageModalActionContext.Provider value={action}>
            {children}
            <DeleteMessageModalComponent
                hidden={state.hidden}
                message={state.message}
                modalAction={action}
                deleteMessage={deleteMessage}
                theme={theme}
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
