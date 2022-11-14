import {
    ChannelGroupObjectT,
    ChannelObjectT,
    MessageObjectT,
    UserObjectT,
} from "../../../api/object"
import React, { MouseEvent, useContext } from "react"
import { Themes, defaultGlobalDarkTheme } from "../../theme"
import { TooltipActionContext } from "../../../state/component/tooltip"

import { ChannelDescriptionModalActionContext } from "./channel_modal"
import { ChannelHeaderComponent } from "../../chat/content/header"
import { CheckIsConsecutivePost } from "../../chat/content/content"
import { ContentActionT } from "../../../state/chat/actions/contents"
import { ContentStateT } from "../../../state/chat/store/types/app_state"
import { DeleteMessageModalActionT } from "../../../state/component/model/delete_message"
import { MessageActionT } from "../../../state/chat/actions/message"
import { MessageComponent } from "../../chat/message"
import { SVGComponent } from "../../chat/svg"
import { unnormalizeMessage } from "../../../state/chat/store/domain_data/unnormalize"
import { useStore, websocket } from "../../../state/chat/store"

const ChannelListItem = ({ channel }: { channel: ChannelObjectT }) => {
    return (
        <>
            <a className="item">
                <span className="status">{channel.status_string}</span>
                <span className="name">{channel.name}</span>
            </a>
            <style jsx>{`
                a {
                    position: relative;
                    display: flex;
                    align-items: center;
                    height: 36px;
                    padding: 0 12px 0 8px;
                    border-radius: 8px;
                    box-sizing: border-box;
                    font-size: 16px;
                    text-decoration: none;
                    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
                    background-color: transparent;
                    transition: 0.05s;
                    cursor: pointer;
                    font-weight: 500;
                }
                .status {
                    width: 24px;
                    height: 24px;
                    text-align: center;
                    padding-right: 6px;
                    flex: 0 0 24px;
                }
                .name {
                    flex: 0 1 auto;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                a {
                    color: #7d7d7d;
                }
                a:hover {
                    color: white;
                    background-color: black;
                    text-decoration: none;
                }
            `}</style>
        </>
    )
}

const NavigationbarComponent = () => {
    return (
        <div className="inner">
            <a className="button home">
                <svg className="icon">
                    <use href="#icon-home"></use>
                </svg>
                <div className="modal-container">
                    <div className="menu">
                        <p>ホームタイムラインにはフォローしているチャンネルの投稿が表示されます</p>
                    </div>
                    <div className="triangle"></div>
                </div>
            </a>
            <a className="button">
                <svg className="icon">
                    <use href="#icon-chat"></use>
                </svg>
            </a>
            <a className="button">
                <svg className="icon at">
                    <use href="#icon-at"></use>
                </svg>
            </a>
            <a className="button">
                <svg className="icon search">
                    <use href="#icon-search"></use>
                </svg>
            </a>
            <style jsx>{`
                .inner {
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding-top: 8px;
                }
                .button {
                    flex: 0 0 auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 12px;
                    box-sizing: border-box;
                    background-color: transparent;
                    transition: 0.05s;
                    cursor: pointer;
                    width: 40px;
                    height: 40px;
                    margin-bottom: 4px;
                    position: relative;
                }
                .button:hover .modal-container {
                    display: block;
                }
                .icon {
                    width: 20px;
                    height: 20px;
                    text-align: center;
                    flex-shrink: 0;
                    stroke-width: 0.5px;
                    stroke: #7d7d7d;
                    fill: #7d7d7d;
                }
                .icon.at {
                    stroke-width: 0;
                    width: 21px;
                    height: 21px;
                }
                .icon.search {
                    width: 19px;
                    height: 19px;
                }
                .button:hover {
                    background-color: rgb(17, 17, 17);
                }
                .button:hover svg {
                    stroke: white;
                    fill: white;
                }
                .button.home:hover svg {
                    stroke: #f28369;
                    fill: #f28369;
                }
                .modal-container {
                    display: none;
                    position: absolute;
                    top: -37px;
                    right: 56px;
                    z-index: 100;
                    transition: opacity 0.1s;
                    visibility: visible;
                    border-radius: 12px;
                    box-sizing: border-box;
                    padding: 24px;
                    width: 300px;
                    background-color: rgba(13, 13, 13, 0.9);
                    backdrop-filter: blur(50px) saturate(180%);
                    border-radius: 10px;
                    opacity: 1;
                }
                .modal-container.hidden {
                    z-index: 0;
                    opacity: 0;
                }
                p {
                    margin: 0;
                    padding: 0;
                    line-height: 1.5em;
                    font-size: 15px;
                }
                .triangle {
                    position: absolute;
                    width: 20px;
                    height: 20px;
                    background-color: rgb(13, 13, 13);
                    transform: rotate(45deg);
                    top: calc(50% - 10px);
                    right: -10px;
                }
            `}</style>
        </div>
    )
}

export const AppPreviewComponent = (props: {
    channels: ChannelObjectT[]
    messages: MessageObjectT[]
    channelGroup: ChannelGroupObjectT
}) => {
    const { channels, messages, channelGroup } = props
    const theme: Themes = {
        global: {
            current: defaultGlobalDarkTheme,
            setCurrentTheme: (key: string) => {},
        },
        user: null,
    }
    const tooltipAction = useContext(TooltipActionContext)
    const channelDescriptionModalAction = useContext(ChannelDescriptionModalActionContext)
    const { domainData, appState, reducers } = useStore({
        channelGroup: {
            object: channelGroup,
            messages,
        },
        initialDomainData: {
            channelGroups: [],
            channels: [],
        },
    })
    websocket.use({
        reducers,
        appState,
    })

    const channelList = channels.map((channel, n) => {
        return <ChannelListItem key={n} channel={channel} />
    })
    const consectivePostChecker = new CheckIsConsecutivePost()
    const messageAction: MessageActionT = {
        editMessage: (message: MessageObjectT) => (event: MouseEvent<Element>) => {},
        deleteMessage: (message: MessageObjectT) => {},
        createLike: (message: MessageObjectT) => (event: MouseEvent<Element>) => {},
        createFavorite: (message: MessageObjectT) => (event: MouseEvent<Element>) => {},
        destroyFavorite: (message: MessageObjectT) => (event: MouseEvent<Element>) => {},
        createMutes: (user: UserObjectT) => (event: MouseEvent<Element>) => {},
        destroyMutes: (user: UserObjectT) => (event: MouseEvent<Element>) => {},
        createBlocks: (user: UserObjectT) => (event: MouseEvent<Element>) => {},
        destroyBlocks: (user: UserObjectT) => (event: MouseEvent<Element>) => {},
    }
    const contentAction: ContentActionT = {
        closeContent: (content: ContentStateT) => {},
        loadLatestMessagesIfNeeded: (content: ContentStateT) => {},
        // @ts-ignore
        openChannel: (channel: ChannelObjectT, insertColumnAfter?: number) => {},
    }
    const deleteMessageModalAction: DeleteMessageModalActionT = {
        show: (message: MessageObjectT) => {},
        hide: () => {},
    }
    const messageComponentList = [...appState.contents[0][0].timeline.messageIds]
        .reverse()
        .map((messageId) => {
            const normalizedMessage = domainData.messages.get(messageId)
            if (normalizedMessage == null) {
                return null
            }
            const message = unnormalizeMessage(normalizedMessage, domainData)
            return (
                <MessageComponent
                    key={messageId}
                    message={message}
                    messageAction={messageAction}
                    contentAction={contentAction}
                    tooltipAction={tooltipAction}
                    deleteMessageModalAction={deleteMessageModalAction}
                    domainData={domainData}
                    loggedInUser={null}
                    content={null}
                    isConsecutivePost={consectivePostChecker.check(message)}
                    theme={theme}>
                    {message.text}
                </MessageComponent>
            )
        })
    return (
        <>
            <div className="navigationbar-block">
                <NavigationbarComponent />
            </div>
            <div
                className="sidebar-block"
                onMouseEnter={(e) => channelDescriptionModalAction.show(e)}
                onMouseLeave={() => channelDescriptionModalAction.hide()}>
                {channelList}
            </div>
            <div className="contents-block">
                <div className="timeline-block">
                    <div className="card">
                        <div className="header">
                            <ChannelHeaderComponent
                                channel={{
                                    id: -1,
                                    unique_name: "global",
                                    description: "",
                                    created_at: new Date(),
                                    created_by: -1,
                                    message_count: 0,
                                    parent_channel_group_id: -1,
                                    parent_channel_group: null,
                                    last_message_id: null,
                                    last_message_created_at: null,
                                    last_message: null,
                                    read_state: null,
                                    name: "パブリックタイムライン",
                                    status_string: "#",
                                }}
                                theme={theme}
                            />
                        </div>
                        <div className="timeline">
                            <div className="scroller">
                                <div className="message-container">{messageComponentList}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <SVGComponent />
            <style jsx>{`
                svg {
                    display: none;
                }
                .navigationbar-block {
                    width: 70px;
                    background-color: rgba(42, 42, 42, 0.7);
                    border-radius: 10px 0 0 10px;
                }
                .sidebar-block {
                    flex: 0 1 30%;
                    padding: 8px;
                    box-sizing: border-box;
                    border: 3px solid transparent;
                    transition: border-color 0.1s;
                    min-width: 0;
                    background-color: rgba(19, 19, 19, 0.9);
                }
                .sidebar-block:hover {
                    border-color: #f28369;
                }
                .contents-block {
                    flex: 1 1 70%;
                    box-sizing: border-box;
                    background-color: rgba(19, 19, 19, 0.9);
                    display: flex;
                    flex-direction: column;
                    border-radius: 0 10px 10px 0;
                }
                .timeline-block {
                    flex: 1 1 auto;
                    display: flex;
                    flex-direction: column;
                    padding: 12px;
                    overflow: hidden;
                }
                .card {
                    flex: 1 1 auto;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    background-color: rgba(180, 180, 180, 0.1);
                    border-radius: 8px;
                    position: relative;
                }
                .header {
                    flex: 0 0 auto;
                    z-index: 2;
                }
                .timeline {
                    flex: 1 1 auto;
                    min-width: 0;
                    min-height: 0;
                    display: flex;
                    flex-direction: column;
                    z-index: 1;
                    padding: 0 0 10px 0;
                }
                .scroller::-webkit-scrollbar {
                    width: 0px;
                }
                .scroller::-webkit-scrollbar-thumb {
                    border-radius: 10px;
                    background-color: gray;
                }
                .scroller::-webkit-scrollbar-track-piece {
                    background-clip: padding-box;
                    background-color: transparent;
                    border-color: transparent;
                }
                .scroller {
                    flex: 1 1 auto;
                    display: flex;
                    flex-direction: column-reverse;
                    overflow-x: hidden;
                    overflow-y: scroll;
                    position: relative;
                }
                .message-container {
                    flex: 1 1 auto;
                    display: flex;
                    flex-direction: column;
                }
                .search-block {
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-end;
                }
            `}</style>
        </>
    )
}
