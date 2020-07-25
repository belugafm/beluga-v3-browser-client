import { createContext, MouseEvent } from "react"
import { StatusObjectT, UserObjectT } from "../api/object"
import * as reducers from "./chat/reducer_methods"
import { ReducersT } from "./chat/reducer"
import { Response } from "../api"
import { ReducerMethodT } from "./chat/state"

export const useStatusMethods = ({ reducer, orderedReducers }: ReducersT): StatusMethodsT => {
    function reduce<T>(method: ReducerMethodT<T>, query: T): Promise<Response | null> {
        return reducer(method, query)
    }

    const edit = (status: StatusObjectT) => {
        return (event: MouseEvent<Element>) => {
            event.preventDefault()
        }
    }
    const destroy = (status: StatusObjectT) => {
        return (event: MouseEvent<Element>) => {
            event.preventDefault()
            reduce(reducers.statuses.destroy, {
                statusId: status.id,
            })
        }
    }
    const createLike = (status: StatusObjectT) => {
        return (event: MouseEvent<Element>) => {
            event.preventDefault()
            reduce(reducers.likes.create, {
                statusId: status.id,
            })
        }
    }
    const createFavorite = (status: StatusObjectT) => {
        return (event: MouseEvent<Element>) => {
            event.preventDefault()
            reduce(reducers.favorites.create, {
                statusId: status.id,
            })
        }
    }
    const destroyFavorite = (status: StatusObjectT) => {
        return (event: MouseEvent<Element>) => {
            event.preventDefault()
            reduce(reducers.favorites.destroy, {
                statusId: status.id,
            })
        }
    }
    const createMutes = (user: UserObjectT) => {
        return (event: MouseEvent<Element>) => {
            event.preventDefault()
            reduce(reducers.mutes.create, {
                userId: user.id,
            })
        }
    }
    const destroyMutes = (user: UserObjectT) => {
        return (event: MouseEvent<Element>) => {
            event.preventDefault()
            reduce(reducers.mutes.destroy, {
                userId: user.id,
            })
        }
    }
    const createBlocks = (user: UserObjectT) => {
        return (event: MouseEvent<Element>) => {
            event.preventDefault()
            reduce(reducers.blocks.create, {
                userId: user.id,
            })
        }
    }
    const destroyBlocks = (user: UserObjectT) => {
        return (event: MouseEvent<Element>) => {
            event.preventDefault()
            reduce(reducers.blocks.destroy, {
                userId: user.id,
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
