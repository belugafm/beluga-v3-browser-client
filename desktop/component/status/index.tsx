import { StatusObject } from "../../api/object"
import equals from "deep-equal"
import { useContext } from "react"
import { StatusMethods, StatusMethodsT } from "../../state/status"

type PropsT = {
    status: StatusObject
    methods: StatusMethodsT
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
    (prevProps: { status: StatusObject }, nextProps: { status: StatusObject }) => {
        return equals(prevProps.status, nextProps.status)
    }
)
