import { createContext, MouseEvent } from "react"
import { StatusObjectT, UserObjectT } from "../api/object"
import * as reducers from "../state/chat/reducers"
import { ReducersT } from "./chat/reducer"

export const useStatusMethods = ({ reducer, orderedReducers }: ReducersT): StatusMethodsT => {
    const edit = (status: StatusObjectT) => {
        return (event: MouseEvent<Element>) => {
            event.preventDefault()
        }
    }
    const destroy = (status: StatusObjectT) => {
        return (event: MouseEvent<Element>) => {
            event.preventDefault()
            reducer(reducers.statuses.destroy, {
                status_id: status.id,
            })
        }
    }
    const createLike = (status: StatusObjectT) => {
        return (event: MouseEvent<Element>) => {
            event.preventDefault()
            reducer(reducers.likes.create, {
                status_id: status.id,
            })
        }
    }
    const createFavorite = (status: StatusObjectT) => {
        return (event: MouseEvent<Element>) => {
            event.preventDefault()
            reducer(reducers.favorites.create, {
                status_id: status.id,
            })
        }
    }
    const destroyFavorite = (status: StatusObjectT) => {
        return (event: MouseEvent<Element>) => {
            event.preventDefault()
            reducer(reducers.favorites.destroy, {
                status_id: status.id,
            })
        }
    }
    const createMutes = (user: UserObjectT) => {
        return (event: MouseEvent<Element>) => {
            event.preventDefault()
            reducer(reducers.mutes.create, {
                user_id: user.id,
            })
        }
    }
    const destroyMutes = (user: UserObjectT) => {
        return (event: MouseEvent<Element>) => {
            event.preventDefault()
            reducer(reducers.mutes.destroy, {
                user_id: user.id,
            })
        }
    }
    const createBlocks = (user: UserObjectT) => {
        return (event: MouseEvent<Element>) => {
            event.preventDefault()
            reducer(reducers.blocks.create, {
                user_id: user.id,
            })
        }
    }
    const destroyBlocks = (user: UserObjectT) => {
        return (event: MouseEvent<Element>) => {
            event.preventDefault()
            reducer(reducers.blocks.destroy, {
                user_id: user.id,
            })
        }
    }
    return {
        edit,
        destroy,
        createLike,
        createFavorite,
        destroyFavorite,
        createMutes,
        destroyMutes,
        createBlocks,
        destroyBlocks,
    }
}

export type StatusMethodsT = {
    edit: (status: StatusObjectT) => (event: MouseEvent<Element>) => void
    destroy: (status: StatusObjectT) => (event: MouseEvent<Element>) => void
    createLike: (status: StatusObjectT) => (event: MouseEvent<Element>) => void
    createFavorite: (status: StatusObjectT) => (event: MouseEvent<Element>) => void
    destroyFavorite: (status: StatusObjectT) => (event: MouseEvent<Element>) => void
    createMutes: (user: UserObjectT) => (event: MouseEvent<Element>) => void
    destroyMutes: (user: UserObjectT) => (event: MouseEvent<Element>) => void
    createBlocks: (user: UserObjectT) => (event: MouseEvent<Element>) => void
    destroyBlocks: (user: UserObjectT) => (event: MouseEvent<Element>) => void
}

const methods: StatusMethodsT = {
    edit: null,
    destroy: null,
    createLike: null,
    createFavorite: null,
    destroyFavorite: null,
    createMutes: null,
    destroyMutes: null,
    createBlocks: null,
    destroyBlocks: null,
}

export const StatusMethods = createContext(methods)
