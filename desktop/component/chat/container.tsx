import { ContentActionContext, useContentAction } from "../../state/chat/actions/contents"
import { MessageActionContext, useMessageAction } from "../../state/chat/actions/message"
import { Themes, useTheme } from "../theme"
import { TooltipActionContext, useTooltipState } from "../../state/component/tooltip"
import { websocket, polling, useStore } from "../../state/chat/store"

import { AppStateContext } from "../../state/chat/store/app_state"
import Cookie from "cookie"
import { DomainDataContext } from "../../state/chat/store/domain_data"
import { GetServerSideProps } from "next"
import { ModalContextProvider } from "./modal/context_provider"
import { ReducerContext } from "../../state/chat/store/types/reducer"
import { TooltipComponent } from "./tooltip"
import { swrGetLoggedInUser } from "../../swr/session"
import { PageContextObjectT } from "../../state/chat/store/types/page_context"

const LoadingComponent = () => {
    const [theme] = useTheme()
    return getStyleForTheme(theme)
}

const getStyleForTheme = (theme: Themes) => {
    if (theme.global.current.light || theme.global.current.lightWithBgImage) {
        return (
            <style jsx global>{`
                body {
                    background-color: #f4f4f4;
                    color: #1a1a1a;
                }
            `}</style>
        )
    }
    if (theme.global.current.dark || theme.global.current.darkWithBgImage) {
        return (
            <style jsx global>{`
                body {
                    background-color: #111315;
                    color: #fafafa;
                }
            `}</style>
        )
    }
}

const getFontStyle = () => {
    return (
        <style jsx global>{`
            @import url("https://fonts.googleapis.com/css2?family=M+PLUS+1:wght@300;400;500;700&display=swap");
            body,
            button {
                font-family: "M PLUS 1", sans-serif;
                font-weight: 400;
                padding: 0;
                margin: 0;
            }
        `}</style>
    )
    return (
        <style jsx global>{`
            @import url("https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&display=swap");
            body,
            button {
                font-family: "Noto Sans JP", sans-serif;
                font-weight: 400;
                padding: 0;
                margin: 0;
            }
        `}</style>
    )
}

export const ContainerComponent = ({
    children,
    pageContext,
}: {
    children: any
    pageContext: PageContextObjectT
}) => {
    const [theme] = useTheme()
    const { isLoading, loggedInUser } = swrGetLoggedInUser()
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
    if (isLoading) {
        return <LoadingComponent />
    }
    if (loggedInUser == null) {
        return (
            <div>
                <a href="/login">ログイン</a>してください
            </div>
        )
    }
    return (
        <>
            <div className="app">
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
            </div>
            <style jsx>{`
                .app {
                    background-size: 100% auto;
                    height: 100vh;
                    width: 100vw;
                    padding: 80px 0 0 300px;
                    box-sizing: border-box;
                    position: relative;
                }
            `}</style>
            <style jsx global>{`
                body {
                    font-weight: 400;
                    padding: 0;
                    margin: 0;
                }
                .translucent {
                    backdrop-filter: blur(10px) saturate(180%);
                }
            `}</style>
            {getFontStyle()}
            {getStyleForTheme(theme)}
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const cookie = Cookie.parse(context.req.headers.cookie || "")
    const { theme } = cookie
    const { params } = context
    return {
        props: {
            theme: theme ? theme : null,
            params: params ? params : {},
        },
    }
}
