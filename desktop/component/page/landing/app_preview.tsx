import {
    ChannelGroupObjectT,
    ChannelObjectT,
    MessageObjectT,
    UserObjectT,
} from "../../../api/object"
import React, { MouseEvent, useContext } from "react"
import {
    Themes,
    defaultGlobalDarkTheme,
    defaultGlobalLightTheme,
    defaultUserDarkTheme,
    defaultUserLightTheme,
    useTheme,
} from "../../theme"
import { TooltipActionContext, useTooltipState } from "../../../state/component/tooltip"

import { ChannelDescriptionModalActionContext } from "./channel_modal"
import { ChannelHeaderComponent } from "../../chat/content/header"
import { CheckIsConsecutivePost } from "../../chat/content/content"
import { ContentActionT } from "../../../state/chat/store/app_state/action"
import { ContentStateT } from "../../../state/chat/store/types/app_state"
import { DeleteMessageModalActionT } from "../../../state/component/model/delete_message"
import { MessageActionT } from "../../../state/chat/components/message"
import { MessageComponent } from "../../chat/message"
import { SVGComponent } from "../../chat/svg"
import { unnormalizeMessage } from "../../../state/chat/store/domain_data/unnormalize"
import { useStore } from "../../../state/chat"

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
                    width: 100%;
                    height: 36px;
                    padding: 0 12px 0 8px;
                    border-radius: 8px;
                    white-space: nowrap;
                    box-sizing: border-box;
                    font-size: 16px;
                    text-decoration: none;
                    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
                    background-color: transparent;
                    transition: 0.05s;
                    overflow: hidden;
                    white-space: nowrap;
                    cursor: pointer;
                    font-weight: 500;
                }
                .status {
                    width: 24px;
                    height: 24px;
                    text-align: center;
                    padding-right: 6px;
                    flex-shrink: 0;
                }
                .name {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                a {
                    color: #6f767d;
                }
                a:hover {
                    color: #1a1d1f;
                    background-color: #f4f4f4;
                    text-decoration: none;
                }
            `}</style>
        </>
    )
}

const SearchComponent = () => {
    return (
        <div className="input-block">
            <svg className="icon">
                <use href="#icon-search"></use>
            </svg>
            <input type="text" placeholder="検索" />
            <style jsx>{`
                .input-block {
                    background-color: #f4f4f4;
                    border-radius: 30px;
                    display: flex;
                    flex-direction: row;
                    height: 36px;
                    flex: 0 0 200px;
                    box-sizing: border-box;
                    padding: 0 8px;
                    align-items: center;
                }
                .icon {
                    flex: 0 0 30px;
                    width: 18px;
                    height: 18px;
                    fill: #333;
                }
                input {
                    color: #333;
                    flex: 0 0 140px;
                    width: 140px;
                    border-width: 1px;
                    font-size: 15px;
                    padding: 0 10px;
                    border: none;
                    height: 36px;
                    box-sizing: border-box;
                    outline: none;
                    background: none;
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
            dark: defaultGlobalDarkTheme,
            light: defaultGlobalLightTheme,
            current: defaultGlobalLightTheme,
            setCurrentTheme: (key: string) => {},
        },
        user: null,
    }
    const tooltipAction = useContext(TooltipActionContext)
    const channelDescriptionModalAction = useContext(ChannelDescriptionModalActionContext)
    const { domainData } = useStore({
        channelGroup: {
            object: channelGroup,
            messages,
        },
        initialDomainData: {
            channelGroups: [],
            channels: [],
        },
    })

    const channelList = channels.map((channel, n) => {
        return <ChannelListItem key={n} channel={channel} />
    })
    const consectivePostChecker = new CheckIsConsecutivePost()
    const messageAction: MessageActionT = {
        edit: (message: MessageObjectT) => (event: MouseEvent<Element>) => {},
        delete: (message: MessageObjectT) => {},
        createLike: (message: MessageObjectT) => (event: MouseEvent<Element>) => {},
        createFavorite: (message: MessageObjectT) => (event: MouseEvent<Element>) => {},
        destroyFavorite: (message: MessageObjectT) => (event: MouseEvent<Element>) => {},
        createMutes: (user: UserObjectT) => (event: MouseEvent<Element>) => {},
        destroyMutes: (user: UserObjectT) => (event: MouseEvent<Element>) => {},
        createBlocks: (user: UserObjectT) => (event: MouseEvent<Element>) => {},
        destroyBlocks: (user: UserObjectT) => (event: MouseEvent<Element>) => {},
    }
    const contentAction: ContentActionT = {
        content: {
            close: (content: ContentStateT) => {},
            loadLatestMessagesIfNeeded: (content: ContentStateT) => {},
        },
        channel: {
            // @ts-ignore
            open: (channel: ChannelObjectT, insertColumnAfter?: number) => {},
        },
    }
    const deleteMessageModalAction: DeleteMessageModalActionT = {
        show: (message: MessageObjectT) => {},
        hide: () => {},
    }
    const messageids = [...messages].map((message) => message.id)
    const messageComponentList = messageids
        .reverse()
        .map((messageId, n) => {
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
                    zIndex={n}
                    theme={theme}>
                    {message.text}
                </MessageComponent>
            )
        })
        .reverse()
    return (
        <>
            <div
                className="sidebar-block"
                onMouseEnter={(e) => channelDescriptionModalAction.show(e)}
                onMouseLeave={() => channelDescriptionModalAction.hide()}>
                {channelList}
            </div>
            <div className="contents-block">
                <div className="search-block">
                    <SearchComponent />
                </div>
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
                                    last_message_id: -1,
                                    last_message: null,
                                    read_state: null,
                                    name: "パブリックタイムライン",
                                    status_string: "#",
                                }}
                                theme={theme}
                            />
                        </div>
                        <div className="timeline">
                            <div className="scroller">{messageComponentList}</div>
                        </div>
                    </div>
                </div>
            </div>
            <SVGComponent />
            <style jsx>{`
                svg {
                    display: none;
                }
                .sidebar-block {
                    flex: 1 1 30%;
                    background-color: white;
                    padding: 8px;
                    box-sizing: border-box;
                    border: 3px solid transparent;
                    transition: border-color 0.1s;
                    border-radius: 10px 0 0 10px;
                }
                .sidebar-block:hover {
                    border-color: #ff6b81;
                }
                .contents-block {
                    flex: 1 1 70%;
                    box-sizing: border-box;
                    background-color: rgba(255, 255, 255, 0.8);
                    background: linear-gradient(
                        135deg,
                        rgba(255, 255, 255, 0.8) 0%,
                        rgba(255, 255, 255, 0.6) 75%,
                        rgba(255, 255, 255, 0) 100%
                    );
                    display: flex;
                    flex-direction: column;
                }
                .search-block {
                    background-color: white;
                    box-shadow: inset 1px 0px 0px #f3f3f3, inset 0 -1px 0px #eee;
                    flex: 0 0 60px;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    box-sizing: border-box;
                    padding: 0 16px;
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
                    background-color: white;
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
                .search-block {
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-end;
                }
            `}</style>
        </>
    )
}
