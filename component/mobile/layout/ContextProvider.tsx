import { ContentActionContext, useContentAction } from "../../../state/chat/actions/contents"
import { MessageActionContext, useMessageAction } from "../../../state/chat/actions/message"
import { websocket, polling, useStore } from "../../../state/chat/store"

import { AppStateContext } from "../../../state/chat/store/app_state"
import { DomainDataContext } from "../../../state/chat/store/domain_data"
import { ReducerContext } from "../../../state/chat/store/types/reducer"
import { PageContextObjectT } from "../../../state/chat/store/types/page_context"
import {
    DrawerActionContext,
    DrawerStateContext,
    useDrawerState,
} from "../../../state/component/drawer"

export const ContextProviderComponent = ({
    children,
    pageContext,
}: {
    children: any
    pageContext: PageContextObjectT
}) => {
    const { domainData, appState, reducers } = useStore(pageContext)
    polling.use({
        reducers,
        appState,
    })
    websocket.use({
        reducers,
        appState,
    })
    const messageAction = useMessageAction(reducers)
    const contentAction = useContentAction({ appState, reducers })
    const [drawerState, drawerAction] = useDrawerState()
    return (
        <>
            <AppStateContext.Provider value={appState}>
                <DomainDataContext.Provider value={domainData}>
                    <ReducerContext.Provider value={reducers}>
                        <ContentActionContext.Provider value={contentAction}>
                            <MessageActionContext.Provider value={messageAction}>
                                <DrawerActionContext.Provider value={drawerAction}>
                                    <DrawerStateContext.Provider value={drawerState}>
                                        {children}
                                    </DrawerStateContext.Provider>
                                </DrawerActionContext.Provider>
                            </MessageActionContext.Provider>
                        </ContentActionContext.Provider>
                    </ReducerContext.Provider>
                </DomainDataContext.Provider>
            </AppStateContext.Provider>
        </>
    )
}
