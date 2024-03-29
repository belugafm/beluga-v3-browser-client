import { ContentActionT } from "../../../../state/chat/actions/contents"
import { ContentStateT } from "../../../../state/chat/store/types/app_state"

export const MenuComponent = ({
    content,
    chatActions,
}: {
    content: ContentStateT
    chatActions: ContentActionT
}) => {
    return (
        <>
            <div className="menu">
                <div className="button">
                    <span>...</span>
                    <div className="items">
                        <ul>
                            {content.options.showMutedMessage ? (
                                <li
                                    onClick={(event) => {
                                        event.preventDefault()
                                        const newOptions = Object.assign({}, content.options)
                                        newOptions.showMutedMessage = false
                                        // chatActions.content.setOptions(content, newOptions)
                                    }}>
                                    ミュート中のユーザーの投稿を非表示にする
                                </li>
                            ) : (
                                <li
                                    onClick={(event) => {
                                        event.preventDefault()
                                        const newOptions = Object.assign({}, content.options)
                                        newOptions.showMutedMessage = true
                                        // chatActions.content.setOptions(content, newOptions)
                                    }}>
                                    ミュート中のユーザーの投稿を表示する
                                </li>
                            )}
                            <li
                                onClick={(event) => {
                                    event.preventDefault()
                                    chatActions.closeContent(content)
                                }}>
                                閉じる
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <style jsx>{`
                .button {
                    cursor: pointer;
                }
                .items {
                    display: none;
                    position: absolute;
                    background-color: white;
                }
                .button:hover .items {
                    display: block;
                }
            `}</style>
        </>
    )
}
