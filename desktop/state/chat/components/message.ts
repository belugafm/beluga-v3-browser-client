import * as reducers from "../store/reducer_method"

import { MessageObjectT, UserObjectT } from "../../../api/object"
import { MouseEvent, createContext } from "react"

import { ReducersT } from "../store/types/reducer"

export const useMessageAction = ({
    asyncReducer: reducer,
    asyncSequentialReducer: sequentialReducer,
}: ReducersT): MessageActionT => {
    return {
        edit: (message: MessageObjectT) => {
            return (event: MouseEvent<Element>) => {
                event.preventDefault()
            }
        },
        delete: (message: MessageObjectT) => {
            reducer(reducers.domainData.message.delete, {
                messageId: message.id,
            })
        },
        createLike: (message: MessageObjectT) => {
            return (event: MouseEvent<Element>) => {
                event.preventDefault()
                reducer(reducers.domainData.likes.create, {
                    messageId: message.id,
                })
            }
        },
        createFavorite: (message: MessageObjectT) => {
            return (event: MouseEvent<Element>) => {
                event.preventDefault()
                reducer(reducers.domainData.favorites.create, {
                    messageId: message.id,
                })
            }
        },
        destroyFavorite: (message: MessageObjectT) => {
            return (event: MouseEvent<Element>) => {
                event.preventDefault()
                reducer(reducers.domainData.favorites.destroy, {
                    messageId: message.id,
                })
            }
        },
        createMutes: (user: UserObjectT) => {
            return (event: MouseEvent<Element>) => {
                event.preventDefault()
                reducer(reducers.domainData.mutes.create, {
                    userId: user.id,
                })
            }
        },
        destroyMutes: (user: UserObjectT) => {
            return (event: MouseEvent<Element>) => {
                event.preventDefault()
                reducer(reducers.domainData.mutes.destroy, {
                    userId: user.id,
                })
            }
        },
        createBlocks: (user: UserObjectT) => {
            return (event: MouseEvent<Element>) => {
                event.preventDefault()
                reducer(reducers.domainData.blocks.create, {
                    userId: user.id,
                })
            }
        },
        destroyBlocks: (user: UserObjectT) => {
            return (event: MouseEvent<Element>) => {
                event.preventDefault()
                reducer(reducers.domainData.blocks.destroy, {
                    userId: user.id,
                })
            }
        },
    }
}

export type MessageActionT = {
    edit: (message: MessageObjectT) => (event: MouseEvent<Element>) => void
    delete: (message: MessageObjectT) => void
    createLike: (message: MessageObjectT) => (event: MouseEvent<Element>) => void
    createFavorite: (message: MessageObjectT) => (event: MouseEvent<Element>) => void
    destroyFavorite: (message: MessageObjectT) => (event: MouseEvent<Element>) => void
    createMutes: (user: UserObjectT) => (event: MouseEvent<Element>) => void
    destroyMutes: (user: UserObjectT) => (event: MouseEvent<Element>) => void
    createBlocks: (user: UserObjectT) => (event: MouseEvent<Element>) => void
    destroyBlocks: (user: UserObjectT) => (event: MouseEvent<Element>) => void
}

export const MessageActionContext = createContext<MessageActionT>({
    edit: null,
    delete: null,
    createLike: null,
    createFavorite: null,
    destroyFavorite: null,
    createMutes: null,
    destroyMutes: null,
    createBlocks: null,
    destroyBlocks: null,
})
