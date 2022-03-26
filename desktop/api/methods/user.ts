import { Response, get } from "../fetch"

async function show(body: { userId: string }): Promise<Response> {
    try {
        const response = await get("user/show", {
            user_id: body.userId,
        })
        return response
    } catch (error) {}
}

export const user = {
    show,
}
