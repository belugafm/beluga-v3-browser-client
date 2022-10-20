export { getServerSideProps } from "../component/chat/next"
import { ServerSideProps } from "../component/chat/next"
import { Device } from "../component/chat/next.types"
import DesktopPage from "../pages_impl/desktop/login_with_twitter"

export default (props: ServerSideProps) => {
    const { device } = props
    if (device == Device.Tablet) {
        return <DesktopPage {...props} />
    }
    if (device == Device.Mobile) {
    }
    return <DesktopPage {...props} />
}
