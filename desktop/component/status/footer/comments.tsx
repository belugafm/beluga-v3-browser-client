import { DomainDataT } from "../../../state/chat/state/data/types"

export default ({ count, domainData }: { count: number; domainData: DomainDataT }) => {
    if (count == 0) {
        return null
    }
    return (
        <div className="likes">
            <span>{count}</span>
            <span>コメント</span>
        </div>
    )
}
