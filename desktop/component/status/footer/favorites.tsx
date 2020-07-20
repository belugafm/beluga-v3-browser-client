import { UserObjectT } from "../../../api/object"

export default ({ count, users }: { count: number; users: UserObjectT[] }) => {
    if (count == 0) {
        return null
    }
    return (
        <div className="favorites">
            <span>{count}</span>
            <span>ふぁぼ</span>
            <style jsx>{`
                .favorites {
                }
            `}</style>
        </div>
    )
}
