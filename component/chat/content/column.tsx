import { ChannelContentComponent } from "./channel"
import { ChannelGroupContentComponent } from "./channel_group"
import { ContentStateT } from "../../../state/chat/store/types/app_state"
import React from "react"
import { ContentType } from "../../../state/chat/store/app_state"

export const ContentColumnComponent = ({ contentRows }: { contentRows: ContentStateT[] }) => {
    console.debug("ContentColumnComponent::render")
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
                })}
            </div>
            <style jsx>{`
                .container {
                    display: flex;
                    flex-direction: row;
                    flex: 1 1 700px;
                    min-width: 400px;
                    max-width: 700px;
                }
                .rows {
                    display: flex;
                    flex: 1 1 auto;
                    flex-direction: column;
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
