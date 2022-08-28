import { ContentActionT } from "../store/app_state/action"
import { ContentStateT } from "../store/types/app_state"
import { useEffect, useState } from "react"
import config from "../../../config"

function findMaxId(messageIds: string[]) {
    if (messageIds.length > config.timeline.maxNumStatuses) {
        return messageIds[messageIds.length - config.timeline.maxNumStatuses - 1]
    }
    return null
}

function findSinceId(messageIds: string[]) {
    if (messageIds.length > config.timeline.maxNumStatuses) {
        return messageIds[config.timeline.maxNumStatuses + 1]
    }
    return null
}

export class ScrollerState {
    ref: React.MutableRefObject<any>
    content: ContentStateT
    chatActions: ContentActionT
    reqeustedMaxId: string
    reqeustedSinceId: string
    loading: boolean = false
    hasReachedTop: boolean = false
    hasReachedBottom: boolean = false
    scrolled: boolean = false
    prevScrollTop: number = 0
    forceScrollToBottom: boolean = true
    isPendingRequest: boolean = false
    forceScrollToBottomTimerId: NodeJS.Timer = null
    setHasReachedBottom: (t: boolean) => void
    setHasReachedTop: (t: boolean) => void
    setForceScrollToBottom: (t: boolean) => void
    use = ({
        ref,
        content,
        chatActions,
    }: {
        ref: React.MutableRefObject<any>
        content: ContentStateT
        chatActions: ContentActionT
    }) => {
        this.ref = ref
        this.content = content
        this.chatActions = chatActions
        this.reqeustedMaxId = "000000000000"

        const [hasReachedBottom, setHasReachedBottom] = useState(false)
        this.hasReachedBottom = hasReachedBottom
        this.setHasReachedBottom = setHasReachedBottom

        const [forceScrollToBottom, setForceScrollToBottom] = useState(true)
        this.forceScrollToBottom = forceScrollToBottom
        this.setForceScrollToBottom = setForceScrollToBottom

        const [hasReachedTop, setHasReachedTop] = useState(true)
        this.hasReachedTop = hasReachedTop
        this.setHasReachedTop = setHasReachedTop

        useEffect(() => {
            console.log("[ScrollerState] useEffect")
            clearInterval(this.forceScrollToBottomTimerId)
            if (forceScrollToBottom) {
                console.log("[ScrollerState] setInterval")
                this.forceScrollToBottomTimerId = setInterval(() => {
                    const scroller = ref.current as HTMLDivElement
                    const scrollTop = scroller.scrollHeight - scroller.clientHeight
                    if (scrollTop != scroller.scrollTop) {
                        console.log(
                            `[ScrollerState] Set scrollTop: forceScrollToBottom=${forceScrollToBottom}`
                        )
                        scroller.scrollTop = scrollTop
                    }
                }, 100)
            }
        })
    }
    handleScroll = async (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
        console.log("[ScrollerState] handleScroll")
        clearInterval(this.forceScrollToBottomTimerId)
        if (this.isPendingRequest) {
            return
        }
        const scroller = this.ref.current as HTMLDivElement
        const bottomScrollTop = scroller.scrollHeight - scroller.clientHeight
        // macOSでは0.5pxずれるので注意
        if (scroller.scrollTop >= bottomScrollTop - 1) {
            this.setHasReachedBottom(true)
            if (this.content.timeline.upToDate) {
                this.setForceScrollToBottom(true)
            } else {
                this.setForceScrollToBottom(false)
            }
        } else {
            this.setHasReachedBottom(false)
            this.setForceScrollToBottom(false)
        }
        if (scroller.scrollTop == 0) {
            this.setHasReachedTop(true)
        } else {
            this.setHasReachedTop(false)
        }
        if (this.loading) {
            return
        }
        // const { content, chatActions } = this
        // const container = event.target as HTMLDivElement
        // const scroller = this.ref.current as HTMLDivElement
        // const threashold = 100
        // if (container) {
        //     const scrollBottom =
        //         scroller.clientHeight - container.clientHeight - container.scrollTop
        //     const direction = container.scrollTop - this.prevScrollTop
        //     this.prevScrollTop = container.scrollTop
        //     console.log(container.scrollTop, scrollBottom, direction)
        //     if (direction > 0) {
        //         if (scrollBottom < threashold) {
        //             if (this.hasReachedBottom) {
        //                 return
        //             }
        //             const maxId = "0"
        //             if (maxId === this.reqeustedMaxId) {
        //                 return
        //             }
        //             this.loading = true
        //             const limit = config.timeline.maxNumStatuses * 2
        //             const responce = await chatActions.content.setTimelineQuery(
        //                 content,
        //                 Object.assign({}, content.timeline.query, {
        //                     maxId,
        //                     limit,
        //                     sinceId: null,
        //                 })
        //             )
        //             const { messages: statuses } = responce
        //             if (statuses.length < limit) {
        //                 this.hasReachedBottom = true
        //             }
        //             this.reqeustedMaxId = maxId
        //             this.loading = false
        //             this.hasReachedTop = false
        //             this.scrolled = true
        //             return
        //         }
        //     } else {
        //         if (container.scrollTop < threashold) {
        //             if (this.scrolled === false) {
        //                 console.log("this.scrolled === false")
        //                 return
        //             }
        //             if (this.hasReachedTop) {
        //                 console.log("this.hasReachedTop")
        //                 return
        //             }
        //             const sinceId = "0"
        //             if (sinceId === this.reqeustedSinceId) {
        //                 console.log("sinceId === this.reqeustedSinceId")
        //                 return
        //             }
        //             this.loading = true
        //             const limit = config.timeline.maxNumStatuses * 2
        //             const responce = await chatActions.content.setTimelineQuery(
        //                 content,
        //                 Object.assign({}, content.timeline.query, {
        //                     sinceId,
        //                     limit,
        //                     maxId: null,
        //                 })
        //             )
        //             const { messages: statuses } = responce
        //             if (statuses.length < limit) {
        //                 this.hasReachedTop = true
        //             }
        //             this.reqeustedSinceId = sinceId
        //             this.loading = false
        //             this.hasReachedBottom = false
        //             return
        //         }
        //         if (container.scrollTop > 400) {
        //             this.scrolled = true
        //         }
        //     }
        // }
    }
}
