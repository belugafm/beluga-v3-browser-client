import { CommonPropsT } from "../types"
import MenuComponent from "./menu"

export default (props: CommonPropsT) => {
    const { status, methods, domainData, loggedInUser } = props
    return (
        <>
            <div className="buttons">
                <span className="action create-like" onClick={methods.createLike(status)}>
                    いいね
                </span>
                <span className="action create-favorite" onClick={methods.createFavorite(status)}>
                    ふぁぼ
                </span>
                <span className="action destroy-favorite" onClick={methods.destroyFavorite(status)}>
                    ふぁぼ解除
                </span>
                {loggedInUser && loggedInUser.id === status.user_id ? (
                    <span className="action destroy" onClick={methods.destroy(status)}>
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
