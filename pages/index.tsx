export { getServerSideProps } from "../component/chat/next"
import { ServerSideProps } from "../component/chat/next"
import { Device } from "../component/chat/next.types"
import DesktopPage from "../pages_impl/desktop/index"
import MobilePage from "../pages_impl/mobile/index"

export default (props: ServerSideProps) => {
    const { device } = props
    if (device == Device.Tablet) {
        return <DesktopPage {...props} />
    }
    if (device == Device.Mobile) {
        return <MobilePage {...props} />
    }
    return <DesktopPage {...props} />
}
