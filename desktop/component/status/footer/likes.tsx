import { DomainDataT } from "../../../state/chat/state/data"

function sum(array: number[]) {
    if (array.length == 0) {
        return 0
    }
    return array.reduce((accumulator, currentValue) => accumulator + currentValue)
}

export default ({
    count,
    counts,
    domainData,
}: {
    count: number
    counts: {
        count: number
        user_id: string
    }[]
    domainData: DomainDataT
}) => {
    if (count == 0) {
        return null
    }
    const filterdCount = sum(
        counts.map((item) => {
            const { count, user_id } = item
            const user = domainData.users.get(user_id)
            if (user == null) {
                return 0
            }
            if (user.muted) {
                return 0
            }
            return count
        })
    )
    const components = []
    for (let index = 0; index < filterdCount; index++) {
        components.push(<span key={index}>★</span>)
    }
    return (
        <div className="likes">
            {components}
            <style jsx>{`
                .likes {
                }
            `}</style>
        </div>
    )
}
