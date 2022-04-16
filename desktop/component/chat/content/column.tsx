import { ContentComponent } from "./content"
import { ContentStateT } from "../../../state/chat/store/types/app_state"
import React from "react"

export const ContentColumnComponent = ({ contentRows }: { contentRows: ContentStateT[] }) => {
    console.info("ContentColumnComponent::render")
    return (
        <div className="container">
            <div className="rows">
                {contentRows.map((content, index) => {
                    return <ContentComponent key={index} content={content} />
                })}
            </div>
            <style jsx>{`
                .container {
                    display: flex;
                    flex-direction: column;
                    flex: 1 1 auto;
                    min-width: 400px;
                    max-width: 800px;
                }
                .rows {
                    display: flex;
                    flex: 1 1 auto;
                    flex-direction: column;
                    overflow-y: scroll;
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
