import { Response, post, get } from "../fetch"

export const app = {
    create: (body: {
        name: string
        description: string
        callbackUrl: string
        read: boolean
        write: boolean
    }): Promise<Response> => {
        return post("app/create", {
            name: body.name,
            description: body.description,
            callback_url: body.callbackUrl,
            read: body.read,
            write: body.write,
        })
    },
    listApps: (): Promise<Response> => {
        return get("app/list_apps", {})
    },
}
