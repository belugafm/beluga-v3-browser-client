import * as fetch from "../fetch"
import { Response } from "../fetch"

export const invites = {
    show: async (query: { verifier: string }): Promise<Response> => {
        const responce = await fetch.post("message/post", {
            verifier: query.verifier,
        })
        return responce
    },
}
