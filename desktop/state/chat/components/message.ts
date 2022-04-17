import * as reducers from "../reducer_method"

import { AsyncReducerMethodT, AsyncReducersT } from "../store/types/reducer"
import { MessageObjectT, UserObjectT } from "../../../api/object"
import { MouseEvent, createContext } from "react"

import { Response } from "../../../api"

export const useMessageAction = ({
    reducer,
    sequentialReducer: orderedReducers,
}: AsyncReducersT): MessageActionT => {
    function reduce<T>(method: AsyncReducerMethodT<T>, query: T): Promise<Response | null> {
        return reducer(method, query)
    }

    const edit = (message: MessageObjectT) => {
        return (event: MouseEvent<Element>) => {
            event.preventDefault()
        }
    }
    const destroy = (message: MessageObjectT) => {
        return (event: MouseEvent<Element>) => {
            event.preventDefault()
            reduce(reducers.domainData.message.destroy, {
                messageId: message.id,
            })
        }
    }
    const createLike = (message: MessageObjectT) => {
        return (event: MouseEvent<Element>) => {
            event.preventDefault()
            reduce(reducers.domainData.likes.create, {
                messageId: message.id,
            })
        }
    }
    const createFavorite = (message: MessageObjectT) => {
        return (event: MouseEvent<Element>) => {
            event.preventDefault()
            reduce(reducers.domainData.favorites.create, {
                messageId: message.id,
            })
        }
    }
    const destroyFavorite = (message: MessageObjectT) => {
        return (event: MouseEvent<Element>) => {
            event.preventDefault()
            reduce(reducers.domainData.favorites.destroy, {
                messageId: message.id,
            })
        }
    }
    const createMutes = (user: UserObjectT) => {
        return (event: MouseEvent<Element>) => {
            event.preventDefault()
            reduce(reducers.domainData.mutes.create, {
                userId: user.id,
            })
        }
    }
    const destroyMutes = (user: UserObjectT) => {
        return (event: MouseEvent<Element>) => {
            event.preventDefault()
            reduce(reducers.domainData.mutes.destroy, {
                userId: user.id,
            })
        }
    }
    const createBlocks = (user: UserObjectT) => {
        return (event: MouseEvent<Element>) => {
            event.preventDefault()
            reduce(reducers.domainData.blocks.create, {
                userId: user.id,
            })
        }
    }
    const destroyBlocks = (user: UserObjectT) => {
        return (event: MouseEvent<Element>) => {
            event.preventDefault()
            reduce(reducers.domainData.blocks.destroy, {
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

export type MessageActionT = {
    edit: (message: MessageObjectT) => (event: MouseEvent<Element>) => void
    destroy: (message: MessageObjectT) => (event: MouseEvent<Element>) => void
    createLike: (message: MessageObjectT) => (event: MouseEvent<Element>) => void
    createFavorite: (message: MessageObjectT) => (event: MouseEvent<Element>) => void
    destroyFavorite: (message: MessageObjectT) => (event: MouseEvent<Element>) => void
    createMutes: (user: UserObjectT) => (event: MouseEvent<Element>) => void
    destroyMutes: (user: UserObjectT) => (event: MouseEvent<Element>) => void
    createBlocks: (user: UserObjectT) => (event: MouseEvent<Element>) => void
    destroyBlocks: (user: UserObjectT) => (event: MouseEvent<Element>) => void
}

const actions: MessageActionT = {
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

export const MessageActionContext = createContext(actions)
