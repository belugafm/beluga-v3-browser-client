import React from "react"
import { ChannelContentComponent } from "./columns/channel"
import { ChannelGroupContentComponent } from "./columns/channel_group"
import { ContentStateT, ContentType } from "../../../../state/chat/store/types/app_state"
import { SearchContentComponent } from "./columns/search"
import { getStyle } from "../../layout/sidebar"
import { ThreadContentComponent } from "./columns/Thread"
import { ThemeT } from "../../../theme"

export const ContentColumnComponent = ({
    contentRows,
    theme,
}: {
    contentRows: ContentStateT[]
    theme: ThemeT
}) => {
    return (
        <div className="container">
            <div className="rows">
                {contentRows.map((content, index) => {
                    if (content.type == ContentType.Channel) {
                        return <ChannelContentComponent key={index} content={content} />
                    }
                    if (content.type == ContentType.ChannelGroup) {
                        return <ChannelGroupContentComponent key={index} content={content} />
                    }
                    if (content.type == ContentType.Search) {
                        return <SearchContentComponent key={index} content={content} />
                    }
                    if (content.type == ContentType.Thread) {
                        return <ThreadContentComponent key={index} content={content} />
                    }
                })}
            </div>
            <style jsx>{`
                .container {
                    border-left-color: ${getStyle(theme)["backgroundColor"]};
                }
            `}</style>
            <style jsx>{`
                .container {
                    display: flex;
                    flex-direction: row;
                    flex: 1 1 700px;
                    min-width: 300px;
                    max-width: 700px;
                    border-left: 4px solid transparent;
                    transition-duration: 0.2s;
                }
                .rows {
                    display: flex;
                    flex: 1 1 auto;
                    flex-direction: column;
                    width: 100%;
                }
                .rows::-webkit-scrollbar {
                    width: 0px;
                }
                .rows::-webkit-scrollbar-thumb {
                    border-radius: 10px;
                    background-color: gray;
                }
                .rows::-webkit-scrollbar-track-piece {
                    background-clip: padding-box;
                    background-color: transparent;
                    border-color: transparent;
                }
            `}</style>
        </div>
    )
}
