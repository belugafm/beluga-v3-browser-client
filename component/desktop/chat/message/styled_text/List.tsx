import classNames from "classnames"
import { MessageEntityStyleNode } from "../../../../../api/object"

export const ListComponent = ({ children }) => {
    return (
        <>
            <ul>{children}</ul>
        </>
    )
}

export const ListItemComponent = ({
    children,
    node,
}: {
    children: any
    node: MessageEntityStyleNode
}) => {
    const innterList = node.children.filter((child) => child.type == "list")
    const nested = innterList.length == 0 ? false : true
    return (
        <>
            <li
                className={classNames({
                    nested,
                })}>
                {children}
            </li>
            <style jsx>{`
                li.nested {
                    list-style-type: none;
                }
            `}</style>
        </>
    )
}
