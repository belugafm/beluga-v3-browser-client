import { Response, get } from "../fetch"
import { UserId } from "../object"

async function show(body: { userId: UserId }): Promise<Response> {
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
