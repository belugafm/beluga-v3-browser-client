import { ContentActionT } from "../actions/contents"
import { ContentStateT } from "../store/types/app_state"
import { useEffect, useState } from "react"
import { MessageId } from "../../../api/object"

export class ScrollerState {
    ref: React.MutableRefObject<any>
    content: ContentStateT
    contentAction: ContentActionT
    reqeustedMaxId: MessageId | null = null
    reqeustedSinceId: MessageId | null = null
    componentDidMout: boolean = false
    hasReachedTop: boolean = false
    hasReachedBottom: boolean = false
    forceScrollToBottom: boolean = true
    shouldNotifyNewMessages: boolean = false
    isPendingRequest: boolean = false
    lastReadLatestMessageId: MessageId | null = null
    setHasReachedBottom: (on: boolean) => void
    setHasReachedTop: (on: boolean) => void
    setForceScrollToBottom: (on: boolean) => void
    setShouldNotifyNewMessages: (on: boolean) => void
    setComponentDidMout: (on: boolean) => void
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

        const [componentDidMout, setComponentDidMout] = useState(false)
        this.componentDidMout = componentDidMout
        this.setComponentDidMout = (on: boolean) => {
            this.componentDidMout = on
            setComponentDidMout(on)
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
    }
    scrollToBottom = () => {
        const scroller = this.ref.current as HTMLDivElement
        // column-reverseされているので0が見かけ上のbottomになる
        if (scroller.scrollTop != 0) {
            scroller.scrollTop = 0
        }
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
        await this.contentAction.prependMessagesWithMaxId(this.content, maxId)
        this.isPendingRequest = false
    }
    handleScroll = async (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
        console.log("[ScrollerState] handleScroll")
        if (this.isPendingRequest) {
            return
        }
        const scroller = this.ref.current as HTMLDivElement
        const bottomScrollTop = scroller.scrollHeight - scroller.clientHeight
        // macOSでは0.5pxずれるので注意
        // column-reverseされているので注意
        if (scroller.scrollTop > -1) {
            this.setHasReachedBottom(true)
            this.scrollToBottom()
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
        // 400pxのマージンを設ける
        if (scroller.scrollTop <= 400 - bottomScrollTop) {
            this.setHasReachedTop(true)
            this.loadMessagesWithMaxIdIfNeeded()
        } else {
            this.setHasReachedTop(false)
        }
    }
}
