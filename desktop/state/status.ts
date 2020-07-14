import { createContext, MouseEvent } from "react"
import { StatusObjectT } from "../api/object"
import * as reducers from "../state/chat/reducers"
import { StoreT, ReducersT } from "./chat/reducer"

export const useStatusMethods = ({ reducer, orderedReducers }: ReducersT) => {
    const edit = (status: StatusObjectT) => {
        return (event: MouseEvent<Element>) => {
            event.preventDefault()
        }
    }
    const destroy = (status: StatusObjectT) => {
        return (event: MouseEvent<Element>) => {
            event.preventDefault()
        }
    }
    const like = (status: StatusObjectT) => {
        return (event: MouseEvent<Element>) => {
            event.preventDefault()
            reducer(reducers.statuses.like, {
                status_id: status.id,
            })
        }
    }
    const createFavorite = (status: StatusObjectT) => {
        return (event: MouseEvent<Element>) => {
            event.preventDefault()
        }
    }
    const destroyFavorite = (status: StatusObjectT) => {
        return (event: MouseEvent<Element>) => {
            event.preventDefault()
        }
    }
    return {
        edit,
        destroy,
        like,
        createFavorite,
        destroyFavorite,
    }
}

export type StatusMethodsT = {
    edit: (status: StatusObjectT) => (event: MouseEvent<Element>) => void
    destroy: (status: StatusObjectT) => (event: MouseEvent<Element>) => void
    like: (status: StatusObjectT) => (event: MouseEvent<Element>) => void
    createFavorite: (status: StatusObjectT) => (event: MouseEvent<Element>) => void
    destroyFavorite: (status: StatusObjectT) => (event: MouseEvent<Element>) => void
}

const methods: StatusMethodsT = {
    edit: null,
    destroy: null,
    like: null,
    createFavorite: null,
    destroyFavorite: null,
}

export const StatusMethods = createContext(methods)
