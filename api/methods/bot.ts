import { Response, post, get } from "../fetch"

export const bot = {
    create: (body: {
        name: string
        displayName: string
        description: string
        appId: number
    }): Promise<Response> => {
        return post("bot/create", {
            name: body.name,
            display_name: body.displayName,
            description: body.description,
            application_id: body.appId,
        })
    },
    listBots: (): Promise<Response> => {
        return get("bot/list_bots", {})
    },
}
