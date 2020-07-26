import React from "react"
import { StatusObjectT, ChannelObjectT, UserObjectT } from "../../api/object"
import {
    splitTextIntoAtributedTextSequence,
    convertAttributedTextSequenceToRPN,
    AttributedTextType,
    isAttributeTextMarkdown,
    detectUrlType,
    UrlType,
} from "./parser"
import PlainTextComponent from "./components/text"
import CodeComponent from "./components/code"
import InlineMarkdownComponent from "./components/markdown"
import TextLinkComponent from "./components/link"
import TweetComponent from "./components/tweet"
import YouTubeComponent from "./components/youtube"
import ChannelComponent from "./components/channel"
import StatusComponent from "./components/status"

type Props = {
    text: string
    entities: StatusObjectT["entities"]
    options: AttributedTextOptions
    callbacks: AttributedTextCallbacks
}

export type AttributedTextOptions = {
    showOriginalUrl: boolean
    convertChannelNameStringToLink: boolean
    enlargeEmojiWhenTextContainsOnlyEmojis: boolean
    detectAsciiArt: boolean
}

export const defaultOption: AttributedTextOptions = {
    showOriginalUrl: true,
    convertChannelNameStringToLink: false,
    enlargeEmojiWhenTextContainsOnlyEmojis: true,
    detectAsciiArt: true,
} as const

export type AttributedTextCallbacks = {
    handleClickChannel: (channel: ChannelObjectT) => Promise<void>
    handleClickStatus: (status: StatusObjectT) => Promise<void>
    handleClickUser: (user: UserObjectT) => Promise<void>
}

export const AttributedTextComponent = React.memo(
    ({ text, entities, options, callbacks }: Props) => {
        console.info("AttributedTextComponent::render")
        const sequence = splitTextIntoAtributedTextSequence(text, entities)
        const rpn = convertAttributedTextSequenceToRPN(sequence)
        const components = []
        for (let k = 0; k < rpn.length; k++) {
            const attributedText = rpn[k]
            if (attributedText.type === AttributedTextType.Text) {
                components.push(
                    <PlainTextComponent
                        key={k}
                        detectAsciiArt={options.detectAsciiArt}
                        text={attributedText.substr}
                    />
                )
                continue
            }
            if (attributedText.type === AttributedTextType.MarkdownCodeInnerText) {
                components.push(attributedText.substr)
                continue
            }
            if (attributedText.type === AttributedTextType.LineBreak) {
                if (options.enlargeEmojiWhenTextContainsOnlyEmojis) {
                }
                components.push(<br key={k} />)
                continue
            }
            if (isAttributeTextMarkdown(attributedText.type)) {
                const innerComponent = components.pop()
                if (attributedText.type === AttributedTextType.MarkdownCode) {
                    components.push(
                        <CodeComponent
                            key={k}
                            code={innerComponent}
                            language={attributedText.language}
                            disableHighlighting={false}
                        />
                    )
                    continue
                }
                components.push(
                    <InlineMarkdownComponent key={k} type={attributedText.type}>
                        {innerComponent}
                    </InlineMarkdownComponent>
                )
                continue
            }
            if (attributedText.type === AttributedTextType.Channel) {
                const { channel } = attributedText
                if (channel) {
                    components.push(
                        <ChannelComponent
                            key={k}
                            url={attributedText.substr}
                            channel={channel}
                            showOriginalUrl={options.showOriginalUrl}
                            callback={callbacks.handleClickChannel}
                        />
                    )
                    continue
                }
            }
            if (attributedText.type === AttributedTextType.UserMention) {
                const { user } = attributedText
            }
            if (attributedText.type === AttributedTextType.Status) {
                const { status } = attributedText
                if (status) {
                    components.push(
                        <StatusComponent
                            key={k}
                            status={status}
                            url={attributedText.substr}
                            showOriginalUrl={options.showOriginalUrl}
                            callback={callbacks.handleClickStatus}
                        />
                    )
                    continue
                }
            }
            if (attributedText.type === AttributedTextType.UrlText) {
                components.push(
                    <TextLinkComponent key={k} href={attributedText.substr} hidden={false} />
                )
                continue
            }
            if (attributedText.type === AttributedTextType.Url) {
                const type = detectUrlType(attributedText.substr)
                if (type === UrlType.Twitter) {
                    components.push(
                        <TweetComponent
                            key={k}
                            url={attributedText.substr}
                            showOriginalUrl={options.showOriginalUrl}
                        />
                    )
                    continue
                }
                if (type === UrlType.YouTube) {
                    components.push(
                        <YouTubeComponent
                            key={k}
                            url={attributedText.substr}
                            showOriginalUrl={options.showOriginalUrl}
                        />
                    )
                    continue
                }
                components.push(
                    <TextLinkComponent key={k} href={attributedText.substr} hidden={false} />
                )
                continue
            }
            components.push(<span key={k}>{attributedText.substr}</span>)
        }
        if (options.enlargeEmojiWhenTextContainsOnlyEmojis) {
        }
        return <>{components}</>
    },
    (prevProps: Props, nextProps: Props) => {
        return prevProps.text === nextProps.text
    }
)
