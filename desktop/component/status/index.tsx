import { StatusObjectT, UserObjectT } from "../../api/object"
import equals from "deep-equal"
import { StatusMethodsT } from "../../state/status"

type PropsT = {
    status: StatusObjectT
    methods: StatusMethodsT
}

const StatusLikesComponent = ({ count, users }: { count: number; users: UserObjectT[] }) => {
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

export const StatusComponent = React.memo(
    ({ status, methods }: PropsT) => {
        console.info("StatusComponent::render")
        if (status.is_deleted) {
            return null
        }
        return (
            <div className="status">
                {status.text}
                <div className="footer">
                    <StatusLikesComponent count={status.likes.count} users={status.likes.users} />
                    <span className="action like" onClick={methods.like(status)}>
                        いいね
                    </span>
                </div>
                <style jsx>{`
                    .status {
                        min-height: 30px;
                    }
                    .footer .action {
                        cursor: pointer;
                    }
                `}</style>
            </div>
        )
    },
    (prevProps: { status: StatusObjectT }, nextProps: { status: StatusObjectT }) => {
        return equals(prevProps.status, nextProps.status)
    }
)
