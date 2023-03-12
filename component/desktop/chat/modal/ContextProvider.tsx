import {
    ChannelMenuModalActionContext,
    ChannelMenuModalStateContext,
    useChannelMenuModalState,
} from "../../../../state/component/model/channel_menu"
import {
    DeleteMessageModalActionContext,
    useDeleteMessageModalState,
} from "../../../../state/component/model/delete_message"

import { ChannelMenuModalComponent } from "./ChannelMenu"
import { DeleteMessageModalComponent } from "./DeleteMessage"
import { MessageActionContext } from "../../../../state/chat/actions/message"
import React from "react"
import { useContext } from "react"
import { useTheme } from "../../../Theme"
import { PageContextObjectT } from "../../../../state/chat/store/types/page_context"

const DeleteMessageModalActionContextProvider = ({ children }) => {
    const [state, action] = useDeleteMessageModalState()
    const [theme] = useTheme()
    const { deleteMessage } = useContext(MessageActionContext)
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

const ChannelMenuModalActionContextProvider = ({
    children,
    pageContext,
}: {
    children: any
    pageContext: PageContextObjectT
}) => {
    const [state, action] = useChannelMenuModalState(pageContext)
    const [theme] = useTheme()
    if (pageContext.search) {
        return <>{children}</>
    }
    const getChannelGroupId = (pageContext: PageContextObjectT): number => {
        if (pageContext.channel) {
            return pageContext.channel.object.parent_channel_group_id
        }
        if (pageContext.channelGroup) {
            return pageContext.channelGroup.object.id
        }
    }
    const channelGroupId = getChannelGroupId(pageContext)
    return (
        <ChannelMenuModalActionContext.Provider value={action}>
            <ChannelMenuModalStateContext.Provider value={state.hidden}>
                {children}
                <ChannelMenuModalComponent
                    state={state}
                    action={action}
                    theme={theme}
                    channelGroupId={channelGroupId}
                />
            </ChannelMenuModalStateContext.Provider>
        </ChannelMenuModalActionContext.Provider>
    )
}

export const ModalContextProvider = ({
    children,
    pageContext,
}: {
    children: any
    pageContext: PageContextObjectT
}) => {
    return (
        <DeleteMessageModalActionContextProvider>
            <ChannelMenuModalActionContextProvider pageContext={pageContext}>
                {children}
            </ChannelMenuModalActionContextProvider>
        </DeleteMessageModalActionContextProvider>
    )
}
