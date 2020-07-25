import { CommonPropsT } from "../types"

export default ({ status, statusActions, domainData, loggedInUser }: CommonPropsT) => {
    const user = domainData.users.get(status.user_id)
    return (
        <>
            <div className="menu">
                <div className="button">
                    <span>...</span>
                    <div className="items">
                        <ul>
                            {user.muted ? (
                                <li onClick={statusActions.destroyMutes(user)}>
                                    <span>{`@${user.name}`}</span>のミュートを解除
                                </li>
                            ) : (
                                <li onClick={statusActions.createMutes(user)}>
                                    <span>{`@${user.name}`}</span>をミュートする
                                </li>
                            )}
                            {user.blocked ? (
                                <li onClick={statusActions.destroyBlocks(user)}>
                                    <span>{`@${user.name}`}</span>のブロックを解除
                                </li>
                            ) : (
                                <li onClick={statusActions.createBlocks(user)}>
                                    <span>{`@${user.name}`}</span>をブロックする
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
