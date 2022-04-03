import { ChatActionsT } from "../../../state/chat/store/actions"
import { ColumnStateT } from "../../../state/chat/store/app_state"

export default ({ column, chatActions }: { column: ColumnStateT; chatActions: ChatActionsT }) => {
    return (
        <>
            <div className="menu">
                <div className="button">
                    <span>...</span>
                    <div className="items">
                        <ul>
                            {column.timeline.query.includeComments ? (
                                <li
                                    onClick={(event) => {
                                        event.preventDefault()
                                        const newQuery = Object.assign({}, column.timeline.query)
                                        newQuery.includeComments = false
                                        chatActions.column.setTimelineQuery(column, newQuery)
                                    }}>
                                    コメントを含めない
                                </li>
                            ) : (
                                <li
                                    onClick={(event) => {
                                        event.preventDefault()
                                        const newQuery = Object.assign({}, column.timeline.query)
                                        newQuery.includeComments = true
                                        chatActions.column.setTimelineQuery(column, newQuery)
                                    }}>
                                    コメントを含める
                                </li>
                            )}
                            {column.options.showMutedStatuses ? (
                                <li
                                    onClick={(event) => {
                                        event.preventDefault()
                                        const newOptions = Object.assign({}, column.options)
                                        newOptions.showMutedStatuses = false
                                        chatActions.column.setOptions(column, newOptions)
                                    }}>
                                    ミュート中のユーザーの投稿を非表示にする
                                </li>
                            ) : (
                                <li
                                    onClick={(event) => {
                                        event.preventDefault()
                                        const newOptions = Object.assign({}, column.options)
                                        newOptions.showMutedStatuses = true
                                        chatActions.column.setOptions(column, newOptions)
                                    }}>
                                    ミュート中のユーザーの投稿を表示する
                                </li>
                            )}
                            <li
                                onClick={(event) => {
                                    event.preventDefault()
                                    chatActions.column.close(column)
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
