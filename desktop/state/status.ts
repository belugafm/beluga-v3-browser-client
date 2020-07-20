import { createContext, MouseEvent } from "react"
import { StatusObjectT } from "../api/object"
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
    return {
        edit,
        destroy,
        createLike,
        createFavorite,
        destroyFavorite,
    }
}

export type StatusMethodsT = {
    edit: (status: StatusObjectT) => (event: MouseEvent<Element>) => void
    destroy: (status: StatusObjectT) => (event: MouseEvent<Element>) => void
    createLike: (status: StatusObjectT) => (event: MouseEvent<Element>) => void
    createFavorite: (status: StatusObjectT) => (event: MouseEvent<Element>) => void
    destroyFavorite: (status: StatusObjectT) => (event: MouseEvent<Element>) => void
}

const methods: StatusMethodsT = {
    edit: null,
    destroy: null,
    createLike: null,
    createFavorite: null,
    destroyFavorite: null,
}

export const StatusMethods = createContext(methods)
