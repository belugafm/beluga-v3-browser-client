export { getServerSideProps } from "../component/desktop/chat/next"
import { ServerSideProps } from "../component/desktop/chat/next"
import { Device } from "../component/desktop/chat/next.types"
import DesktopPage from "../pages_impl/desktop/search"

export default (props: ServerSideProps) => {
    const { device } = props
    if (device == Device.Tablet) {
        return <DesktopPage {...props} />
    }
    if (device == Device.Mobile) {
    }
    return <DesktopPage {...props} />
}
