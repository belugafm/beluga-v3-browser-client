import { Response, get } from "../classes"

async function show(body: { userId: string }): Promise<Response> {
    try {
        const response = await get("users/show", {
            user_id: body.userId,
        })
        return response
    } catch (error) {}
}

export const users = {
    show,
}
