import { CommonPropsT } from "../types"

export default ({ status, methods, domainData, loggedInUser }: CommonPropsT) => {
    const user = domainData.users.get(status.user_id)
    return (
        <>
            <div className="menu">
                <div className="button">
                    <span>...</span>
                    <div className="items">
                        <ul>
                            {user.muted ? (
                                <li onClick={methods.destroyMutes(user)}>
                                    <span>{`@${user.name}`}</span>のミュートを解除
                                </li>
                            ) : (
                                <li onClick={methods.createMutes(user)}>
                                    <span>{`@${user.name}`}</span>をミュートする
                                </li>
                            )}
                            {user.blocked ? (
                                <li onClick={methods.destroyBlocks(user)}>
                                    <span>{`@${user.name}`}</span>のブロックを解除
                                </li>
                            ) : (
                                <li onClick={methods.createBlocks(user)}>
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
