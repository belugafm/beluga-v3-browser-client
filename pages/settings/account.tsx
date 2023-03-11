export { getServerSideProps } from "../../component/next"
import { ServerSideProps } from "../../component/next"
import { Device } from "../../component/desktop/chat/next.types"
import DesktopPage from "../../pages_impl/desktop/settings/account/Page"

export default (props: ServerSideProps) => {
    const { device } = props
    if (device == Device.Tablet) {
        return <DesktopPage {...props} />
    }
    if (device == Device.Mobile) {
    }
    return <DesktopPage {...props} />
}
