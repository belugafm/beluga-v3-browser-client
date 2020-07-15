import { CommonPropsT } from "../types"

export default ({ status, methods, domainData, loggedInUser }: CommonPropsT) => {
    return (
        <>
            <div className="buttons">
                <span className="action like" onClick={methods.like(status)}>
                    いいね
                </span>
                {loggedInUser && loggedInUser.id === status.user_id ? (
                    <span className="action destroy" onClick={methods.destroy(status)}>
                        削除
                    </span>
                ) : null}
            </div>
            <style jsx>{`
                .buttons {
                    display: flex;
                }
                .action {
                    cursor: pointer;
                }
            `}</style>
        </>
    )
}
