import { ColumnStateT } from "../../../state/chat/state/app"
import { ChatActionsT } from "../../../state/chat/actions"

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
