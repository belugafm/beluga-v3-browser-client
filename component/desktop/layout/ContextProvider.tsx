import { ContentActionContext, useContentAction } from "../../../state/chat/actions/contents"
import { MessageActionContext, useMessageAction } from "../../../state/chat/actions/message"
import { TooltipActionContext, useTooltipState } from "../../../state/component/tooltip"
import { websocket, polling, useStore } from "../../../state/chat/store"

import { AppStateContext } from "../../../state/chat/store/app_state"
import { DomainDataContext } from "../../../state/chat/store/domain_data"
import { ModalContextProvider } from "../chat/modal/ContextProvider"
import { ReducerContext } from "../../../state/chat/store/types/reducer"
import { TooltipComponent } from "../chat/Tooltip"
import { PageContextObjectT } from "../../../state/chat/store/types/page_context"

export const ContextProviderComponent = ({
    children,
    pageContext,
}: {
    children: any
    pageContext: PageContextObjectT
}) => {
    const [state, tooltipAction] = useTooltipState()
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
    return (
        <>
            <AppStateContext.Provider value={appState}>
                <DomainDataContext.Provider value={domainData}>
                    <ReducerContext.Provider value={reducers}>
                        <ContentActionContext.Provider value={contentAction}>
                            <MessageActionContext.Provider value={messageAction}>
                                <TooltipActionContext.Provider value={tooltipAction}>
                                    <ModalContextProvider pageContext={pageContext}>
                                        {children}
                                    </ModalContextProvider>
                                </TooltipActionContext.Provider>
                            </MessageActionContext.Provider>
                        </ContentActionContext.Provider>
                    </ReducerContext.Provider>
                </DomainDataContext.Provider>
            </AppStateContext.Provider>
            <TooltipComponent {...state} />
        </>
    )
}
