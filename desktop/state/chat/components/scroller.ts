import { ContentActionT } from "../actions/contents"
import { ContentStateT } from "../store/types/app_state"
import { useEffect, useState } from "react"
import config from "../../../config"
import { MessageId } from "../../../api/object"

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
    contentAction: ContentActionT
    reqeustedMaxId: MessageId | null = null
    reqeustedSinceId: MessageId | null = null
    loading: boolean = false
    hasReachedTop: boolean = false
    hasReachedBottom: boolean = false
    scrolled: boolean = false
    prevScrollTop: number = 0
    forceScrollToBottom: boolean = true
    shouldNotifyNewMessages: boolean = false
    isPendingRequest: boolean = false
    forceScrollToBottomTimerId: NodeJS.Timer = null
    lastReadLatestMessageId: MessageId | null = null
    setHasReachedBottom: (on: boolean) => void
    setHasReachedTop: (on: boolean) => void
    setForceScrollToBottom: (on: boolean) => void
    setShouldNotifyNewMessages: (on: boolean) => void
    setLastReadLatestMessageId: (messageId: MessageId) => void
    use = ({
        ref,
        content,
        contentAction,
    }: {
        ref: React.MutableRefObject<any>
        content: ContentStateT
        contentAction: ContentActionT
    }) => {
        this.ref = ref
        this.content = content
        this.contentAction = contentAction

        const [hasReachedBottom, setHasReachedBottom] = useState(true)
        this.hasReachedBottom = hasReachedBottom
        this.setHasReachedBottom = setHasReachedBottom

        const [forceScrollToBottom, setForceScrollToBottom] = useState(true)
        this.forceScrollToBottom = forceScrollToBottom
        this.setForceScrollToBottom = (on: boolean) => {
            this.forceScrollToBottom = on
            setForceScrollToBottom(on)
        }

        const [hasReachedTop, setHasReachedTop] = useState(false)
        this.hasReachedTop = hasReachedTop
        this.setHasReachedTop = setHasReachedTop

        const [shouldNotifyNewMessages, setShouldNotifyNewMessages] = useState(false)
        this.shouldNotifyNewMessages = shouldNotifyNewMessages
        this.setShouldNotifyNewMessages = setShouldNotifyNewMessages

        const { lastMessageId } = content.timeline
        const [lastReadLatestMessageId, setLastReadLatestMessageId] = useState(lastMessageId)
        this.lastReadLatestMessageId = lastReadLatestMessageId
        this.setLastReadLatestMessageId = setLastReadLatestMessageId

        useEffect(() => {
            console.log("[ScrollerState] useEffect #1")
            if (this.forceScrollToBottom) {
                this.setLastReadLatestMessageId(lastMessageId)
            }
            if (
                this.isTimelineUpToDate() &&
                this.forceScrollToBottom == false &&
                lastMessageId != this.lastReadLatestMessageId
            ) {
                this.setShouldNotifyNewMessages(true)
            } else {
                this.setShouldNotifyNewMessages(false)
            }
        }, [forceScrollToBottom, lastReadLatestMessageId, lastMessageId, this.isTimelineUpToDate()])

        useEffect(() => {
            console.log("[ScrollerState] useEffect #2")
            clearInterval(this.forceScrollToBottomTimerId)
            if (this.forceScrollToBottom) {
                this.forceScrollToBottomTimerId = setInterval(() => {
                    if (this.forceScrollToBottom) {
                        this.scrollToBottom()
                    }
                }, 100)
            }
        }, [forceScrollToBottom, lastMessageId])
    }
    scrollToBottom = () => {
        const scroller = this.ref.current as HTMLDivElement
        const scrollTop = 0 // column-reverseなので下が0
        scroller.scrollTop = scrollTop
    }
    isTimelineUpToDate = () => {
        const { lastMessageId } = this.content.timeline
        const latestMessageIdInCurrentTimeline =
            this.content.timeline.messageIds.length == 0 ? -1 : this.content.timeline.messageIds[0]
        return lastMessageId === latestMessageIdInCurrentTimeline
    }
    loadMessagesWithMaxIdIfNeeded = async () => {
        if (this.content.timeline.messageIds.length == 0) {
            return
        }
        if (this.isPendingRequest) {
            return
        }
        this.isPendingRequest = true
        const maxId = this.content.timeline.messageIds[this.content.timeline.messageIds.length - 1]
        await this.contentAction.loadMessagesWithMaxId(this.content, maxId)
        this.isPendingRequest = false
    }
    handleScroll = async (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
        console.log("[ScrollerState] handleScroll")
        clearInterval(this.forceScrollToBottomTimerId)
        if (this.isPendingRequest) {
            return
        }
        const scroller = this.ref.current as HTMLDivElement
        // column-reverseなのでscroller.scrollTopは上に行くほどマイナスになる
        // macOSでは0.5pxずれるので注意
        if (scroller.scrollTop >= -1) {
            this.setHasReachedBottom(true)
            if (this.content.timeline.upToDate) {
                this.setForceScrollToBottom(true)
                this.setLastReadLatestMessageId(this.content.timeline.lastMessageId)
            } else {
                this.setForceScrollToBottom(false)
            }
        } else {
            this.setHasReachedBottom(false)
            this.setForceScrollToBottom(false)
        }
        if (scroller.scrollTop <= scroller.clientHeight - scroller.scrollHeight + 1) {
            this.setHasReachedTop(true)
            this.loadMessagesWithMaxIdIfNeeded()
        } else {
            this.setHasReachedTop(false)
        }
        if (this.loading) {
            return
        }
    }
}
