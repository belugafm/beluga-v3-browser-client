import Cookie from "cookie"
import { GetServerSideProps } from "next"
import { isMobile, isTablet } from "react-device-detect"
import { isString } from "../../lib/type_check"
import { Device } from "./next.types"

const getDevice = (prefer_device: string | null) => {
    if (isString(prefer_device)) {
        if (prefer_device == Device.Desktop) {
            return Device.Desktop
        }
        if (prefer_device == Device.Mobile) {
            return Device.Mobile
        }
        if (prefer_device == Device.Tablet) {
            return Device.Tablet
        }
    }
    if (isTablet) {
        return Device.Tablet
    }
    if (isMobile) {
        return Device.Mobile
    }
    return Device.Desktop
}

export type ServerSideProps = {
    theme: string | null
    userName: string | null
    params: { [key: string]: string }
    query: { [key: string]: string }
    device: string
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const cookie = Cookie.parse(context.req.headers.cookie || "")
    const { theme, user_name, prefer_device } = cookie
    const { params, query } = context
    return {
        props: {
            theme: theme ? theme : null,
            userName: user_name ? user_name : null,
            params: params ? params : {},
            query: query ? query : {},
            device: getDevice(prefer_device),
        },
    }
}
