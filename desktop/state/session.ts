import * as api from "../api"

import { UserObjectT } from "../api/object"
import useSWR from "swr"

type ReturnT = {
    loggedInUser: UserObjectT | null
    authenticityToken: string | null
    needsLogin: boolean
    error: any
    isLoading: boolean
}

export const useLoggedInUser = (): ReturnT => {
    const { data, error } = useSWR("logged_in_user", () => {
        return api.auth.cookie.authenticate()
    })
    return {
        loggedInUser: data ? data.user : null,
        authenticityToken: data ? data.authenticityToken : null,
        needsLogin: data ? data["logged_out"] === true : false,
        error: error,
        isLoading: data == null && error == null,
    }
}
