import { DomainDataT } from "../../../state/chat/state/data/types"
import { UserObjectT } from "../../../api/object"

function sum(array: number[]) {
    if (array.length == 0) {
        return 0
    }
    return array.reduce((accumulator, currentValue) => accumulator + currentValue)
}

export default ({
    count,
    userIds,
    domainData,
}: {
    count: number
    userIds: string[]
    domainData: DomainDataT
}) => {
    if (count == 0) {
        return null
    }
    const filteredUsers = userIds.filter((userId) => {
        const user = domainData.users.get(userId)
        if (user == null) {
            return false
        }
        if (user.muted) {
            return false
        }
        return true
    })
    const filterdCount = filteredUsers.length
    if (filterdCount == 0) {
        return null
    }
    return (
        <div className="favorites">
            <span>{filterdCount}</span>
            <span>ふぁぼ</span>
            <style jsx>{`
                .favorites {
                }
            `}</style>
        </div>
    )
}
