import { UserObjectT } from "../../../api/object"

export default ({ count, users }: { count: number; users: UserObjectT[] }) => {
    if (count == 0) {
        return null
    }
    const components = []
    for (let index = 0; index < count; index++) {
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
