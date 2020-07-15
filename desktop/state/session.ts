import useSWR from "swr"
import * as WebAPI from "../api"
import { UserObjectT } from "../api/object"

type ReturnT = {
    loggedInUser: UserObjectT | null
    needsLogin: boolean
    error: any
    isLoading: boolean
}

export const useLoggedInUser = (): ReturnT => {
    const { data, error } = useSWR("logged_in_user", () => {
        return WebAPI.auth.cookie.authenticate()
    })
    return {
        loggedInUser: data ? data["user"] : null,
        needsLogin: data ? data["logged_out"] === true : false,
        error: error,
        isLoading: data == null && error == null,
    }
}
