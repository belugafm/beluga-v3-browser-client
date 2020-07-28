import { CommonPropsT } from "../types"
import MenuComponent from "./menu"

export default (props: CommonPropsT) => {
    const { status, statusActions: statusActions, chatActions, loggedInUser, column } = props
    return (
        <>
            <div className="buttons">
                <span className="action create-like" onClick={statusActions.createLike(status)}>
                    いいね
                </span>
                {status.favorited ? (
                    <span
                        className="action destroy-favorite"
                        onClick={statusActions.destroyFavorite(status)}>
                        ふぁぼ解除
                    </span>
                ) : (
                    <span
                        className="action create-favorite"
                        onClick={statusActions.createFavorite(status)}>
                        ふぁぼ
                    </span>
                )}
                <span
                    className="action create-like"
                    onClick={(event) => {
                        chatActions.thread.open(status, column.index)
                    }}>
                    コメント
                </span>
                {loggedInUser && loggedInUser.id === status.user_id ? (
                    <span className="action destroy" onClick={statusActions.destroy(status)}>
                        削除
                    </span>
                ) : null}
                <MenuComponent {...props} />
            </div>
            <style jsx>{`
                .buttons {
                    display: flex;
                }
                .action {
                    cursor: pointer;
                    margin-right: 4px;
                }
            `}</style>
        </>
    )
}
