import { createContext, MouseEvent } from "react"
import { StatusObject } from "../api/object"
import * as reducers from "../state/chat/reducers"
import { StoreT, ReducersT } from "./chat/reducer"

export const useStatusMethods = (store: StoreT, { reducer, orderedReducers }: ReducersT) => {
    const edit = (status: StatusObject) => {
        return async (event: MouseEvent<HTMLSpanElement, MouseEvent>) => {
            event.preventDefault()
        }
    }
    const destroy = (status: StatusObject) => {
        return async (event: MouseEvent<HTMLSpanElement, MouseEvent>) => {
            event.preventDefault()
        }
    }
    const like = (status: StatusObject) => {
        return async (event: MouseEvent<HTMLSpanElement, MouseEvent>) => {
            event.preventDefault()
            reducer(store, reducers.statuses.like, {
                status_id: status.id,
            })
        }
    }
    const createFavorite = (status: StatusObject) => {
        return async (event: MouseEvent<HTMLSpanElement, MouseEvent>) => {
            event.preventDefault()
        }
    }
    const destroyFavorite = (status: StatusObject) => {
        return async (event: MouseEvent<HTMLSpanElement, MouseEvent>) => {
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
    edit: (
        status: StatusObject
    ) => (event: MouseEvent<HTMLSpanElement, MouseEvent>) => Promise<void>
    destroy: (
        status: StatusObject
    ) => (event: MouseEvent<HTMLSpanElement, MouseEvent>) => Promise<void>
    like: (
        status: StatusObject
    ) => (event: MouseEvent<HTMLSpanElement, MouseEvent>) => Promise<void>
    createFavorite: (
        status: StatusObject
    ) => (event: MouseEvent<HTMLSpanElement, MouseEvent>) => Promise<void>
    destroyFavorite: (
        status: StatusObject
    ) => (event: MouseEvent<HTMLSpanElement, MouseEvent>) => Promise<void>
}

const methods: StatusMethodsT = {
    edit: null,
    destroy: null,
    like: null,
    createFavorite: null,
    destroyFavorite: null,
}

export const StatusMethods = createContext(methods)
