import Cookie from "cookie"
import { GetServerSideProps } from "next"
import { isMobile, isTablet } from "react-device-detect"
import { isString } from "../../lib/type_check"
import { Device } from "./next.types"
import { setCookie } from "cookies-next"
import config from "../../config"
import nookies from "nookies"

const isValidDeviceString = (device: any) => {
    if (isString(device)) {
        if (device == Device.Desktop) {
            return true
        }
        if (device == Device.Mobile) {
            return true
        }
        if (device == Device.Tablet) {
            return true
        }
    }
    return false
}

const getDevice = (cookie_device: any) => {
    if (isString(cookie_device)) {
        if (cookie_device == Device.Desktop) {
            return Device.Desktop
        }
        if (cookie_device == Device.Mobile) {
            return Device.Mobile
        }
        if (cookie_device == Device.Tablet) {
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

const buildQueryString = (query: { [key: string]: string }, exclude_keys: string[]): string => {
    const pairs = []
    Object.keys(query).forEach((key) => {
        if (exclude_keys.includes(key)) {
            return
        }
        const value = query[key]
        pairs.push(`${key}=${value}`)
    })
    if (pairs.length == 0) {
        return ""
    }
    return pairs.join("&")
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const cookie = Cookie.parse(context.req.headers.cookie || "")
    const { theme, user_name } = cookie
    const { params, query } = context
    const device = query.device ? query.device : cookie.device
    if (isValidDeviceString(query.device)) {
        // @ts-ignore
        nookies.set(context, "device", query.device, {
            maxAge: 360 * 24 * 60 * 60,
            httpOnly: !config.server.https,
            secure: config.server.https,
            path: "/",
            domain: config.server.domain,
        })
        // @ts-ignore
        const queryStr = buildQueryString(query, ["device"].concat(Object.keys(context.params)))
        const baseUrl = context.resolvedUrl.replace(/\?.*$/, "")
        return {
            redirect: {
                permanent: false,
                destination: queryStr.length == 0 ? baseUrl : baseUrl + "?" + queryStr,
            },
        }
    }
    return {
        props: {
            theme: theme ? theme : null,
            userName: user_name ? user_name : null,
            params: params ? params : {},
            query: query ? query : {},
            device: getDevice(device),
        },
    }
}
