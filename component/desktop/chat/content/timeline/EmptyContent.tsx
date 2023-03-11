import React from "react"

export const EmptyContentComponent = () => {
    return (
        <div className="empty-timeline">
            <div className="inner">
                <div className="chat-image"></div>
                <div className="description">
                    <span>このチャンネルにはまだ投稿がありません</span>
                    <span>最初のメッセージを投稿してみましょう！</span>
                </div>
            </div>
            <style jsx>{`
                .empty-timeline {
                    flex: 1 1 auto;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                .chat-image {
                    height: 300px;
                    background-image: url("/assets/svg/chat.svg");
                    background-repeat: no-repeat;
                    background-size: 300px auto;
                    background-position: center;
                }
                .description {
                    text-align: center;
                }
                span {
                    display: block;
                    line-height: 2em;
                    font-size: 16px;
                }
            `}</style>
        </div>
    )
}
