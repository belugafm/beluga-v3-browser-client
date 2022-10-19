import { ChannelObjectT, MessageObjectT, UserObjectT } from "../../api/object"

import config from "../../config"

export type AttributedText = {
    indices: number[]
    type: string
    substr: string
    image_url?: string
    language?: string // codeの言語
    url?: string
    channel?: ChannelObjectT
    user?: UserObjectT
    status?: MessageObjectT
}
export const AttributedTextType = {
    Url: "Url",
    UserMention: "UserMention",
    Channel: "Channel",
    Status: "Status",
    Emoji: "Emoji",
    Text: "Text",
    UrlText: "UrlText",
    ImageUrlsText: "ImageUrlsText",
    VideoUrlText: "VideoUrlText",
    EmojiShortnameText: "EmojiShortnameText",
    EmojiUnicodeText: "EmojiUnicodeText",
    PreformattedText: "PreformattedText",
    MarkdownBig: "MarkdownBig",
    MarkdownBold: "MarkdownBold",
    MarkdownUnderline: "MarkdownUnderline",
    MarkdownStrikethrough: "MarkdownStrikethrough",
    MarkdownItalic: "MarkdownItalic",
    MarkdownCode: "MarkdownCode",
    MarkdownCodeInnerText: "MarkdownCodeInnerText",
    MarkdownInlineCode: "MarkdownInlineCode",
    LineBreak: "LineBreak",
    NOP: "NOP",
} as const

const compareEntitySequence = (a: AttributedText, b: AttributedText): number => {
    if (a.indices[0] < b.indices[0]) {
        return -1
    }
    if (a.indices[0] > b.indices[0]) {
        return 1
    }
    return 0
}

const e = (pattern: string): string => {
    return pattern.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&")
}

export const UrlType = {
    YouTube: "YouTube",
    Twitter: "Twitter",
    Website: "Website",
} as const

export const detectUrlType = (url: string): string => {
    if (url.match(/^https?:\/\/(mobile\.)?twitter\.com\/([a-zA-Z0-9_]+)\/status\/([0-9]+)/)) {
        return UrlType.Twitter
    }
    if (url.match(/^https?:\/\/((m\.)|(www\.))?youtube\.com\/watch\?v=[a-zA-Z0-9_\-]+/)) {
        return UrlType.YouTube
    }
    if (url.match(/^https?:\/\/youtu\.be\/[a-zA-Z0-9_\-]+/)) {
        return UrlType.YouTube
    }
    return UrlType.Website
}

export const isAttributeTextMarkdown = (type: string): boolean => {
    if (type === AttributedTextType.MarkdownBig) {
        return true
    }
    if (type === AttributedTextType.MarkdownBold) {
        return true
    }
    if (type === AttributedTextType.MarkdownCode) {
        return true
    }
    if (type === AttributedTextType.MarkdownInlineCode) {
        return true
    }
    if (type === AttributedTextType.MarkdownItalic) {
        return true
    }
    if (type === AttributedTextType.MarkdownStrikethrough) {
        return true
    }
    if (type === AttributedTextType.MarkdownUnderline) {
        return true
    }
    return false
}

const getEntityTypeByMarkdown = (markdown: string): string => {
    if (markdown === config.markdown.big) {
        return AttributedTextType.MarkdownBig
    }
    if (markdown === config.markdown.bold) {
        return AttributedTextType.MarkdownBold
    }
    if (markdown === config.markdown.code) {
        return AttributedTextType.MarkdownCode
    }
    if (markdown === config.markdown.inlineCode) {
        return AttributedTextType.MarkdownInlineCode
    }
    if (markdown === config.markdown.italic) {
        return AttributedTextType.MarkdownItalic
    }
    if (markdown === config.markdown.strikethrough) {
        return AttributedTextType.MarkdownStrikethrough
    }
    if (markdown === config.markdown.underline) {
        return AttributedTextType.MarkdownUnderline
    }
    return null
}

const splitTextIntoEntitiesBySingleLineMarkdown = (
    substr: string,
    offset: number
): AttributedText[] => {
    const sequence: AttributedText[] = []
    const mk = config.markdown
    const base = `(${e(mk.big)}|${e(mk.bold)}|${e(mk.inlineCode)}|${e(mk.italic)}|${e(
        mk.strikethrough
    )}|${e(mk.underline)})(.+)`
    const pattern = new RegExp(
        `^${base}\\1(?=\\s)|(?<=\\s)${base}\\3(?=\\s)|(?<=\\s)${base}\\5$|^${base}\\7$`,
        "gm"
    )
    let match
    while ((match = pattern.exec(substr))) {
        const markdown = match[1] || match[3] || match[5] || match[7]
        const innerText = match[2] || match[4] || match[6] || match[8]
        let startIndex = match.index + offset
        let endIndex = startIndex + markdown.length - 1
        sequence.push({
            indices: [startIndex, endIndex],
            type: getEntityTypeByMarkdown(markdown),
            substr: markdown,
        })
        startIndex += markdown.length
        endIndex += innerText.length
        sequence.push({
            indices: [startIndex, endIndex],
            type: AttributedTextType.Text,
            substr: innerText,
        })
        startIndex += innerText.length
        endIndex += markdown.length
        sequence.push({
            indices: [startIndex, endIndex],
            type: AttributedTextType.NOP,
            substr: markdown,
        })
    }
    if (sequence.length === 0) {
        return [
            {
                indices: [offset, substr.length + offset - 1],
                type: AttributedTextType.Text,
                substr: substr,
            },
        ]
    }
    return fillEntitySequenceWithTextEntities(substr, sequence, offset)
}

const splitInlineMarkdownIntoEntitySequence = (sequence: AttributedText[]) => {
    // markdownは5段階
    // ++ ** __ ~~ *hoge* ~~ __ ** ++ みたいなパターンを想定
    sequence = applySplitOperatorToTextEntities(sequence, splitTextIntoEntitiesBySingleLineMarkdown)
    sequence = applySplitOperatorToTextEntities(sequence, splitTextIntoEntitiesBySingleLineMarkdown)
    sequence = applySplitOperatorToTextEntities(sequence, splitTextIntoEntitiesBySingleLineMarkdown)
    sequence = applySplitOperatorToTextEntities(sequence, splitTextIntoEntitiesBySingleLineMarkdown)
    sequence = applySplitOperatorToTextEntities(sequence, splitTextIntoEntitiesBySingleLineMarkdown)
    return sequence
}

const splitTextIntoEntitiesByLineBreaks = (substr: string, offset: number): AttributedText[] => {
    const pattern = /\n/g
    const sequence: AttributedText[] = []
    let match
    while ((match = pattern.exec(substr))) {
        const substr = match[0]
        const startIndex = match.index + offset
        const endIndex = startIndex + substr.length - 1
        sequence.push({
            type: AttributedTextType.LineBreak,
            indices: [startIndex, endIndex],
            substr: substr,
        })
    }
    if (sequence.length === 0) {
        return [
            {
                indices: [offset, substr.length + offset - 1],
                type: AttributedTextType.Text,
                substr: substr,
            },
        ]
    }
    return fillEntitySequenceWithTextEntities(substr, sequence, offset)
}

const splitTextIntoEntitiesByMultiLineMarkdown = (
    substr: string,
    offset: number
): AttributedText[] => {
    const mk = config.markdown
    const pattern = new RegExp(`(${e(mk.code)})([a-zA-Z]+)?\n(.+?)\n\\1`, "gms")
    const sequence: AttributedText[] = []
    let match
    while ((match = pattern.exec(substr))) {
        const markdown = match[1]
        const language = match[2] ? match[2].toLowerCase() : null
        const innerText = match[3]
        let startIndex = match.index + offset
        let endIndex = startIndex + markdown.length - 1
        sequence.push({
            indices: [startIndex, endIndex],
            type: AttributedTextType.MarkdownCode,
            substr: markdown,
            language: language,
        })
        startIndex += markdown.length
        endIndex += innerText.length + (language ? language.length : 0) + 2
        sequence.push({
            indices: [startIndex, endIndex],
            type: AttributedTextType.MarkdownCodeInnerText,
            substr: innerText,
        })
        startIndex += innerText.length + (language ? language.length : 0) + 2
        endIndex += markdown.length
        sequence.push({
            indices: [startIndex, endIndex],
            type: AttributedTextType.NOP,
            substr: markdown,
        })
    }
    if (sequence.length === 0) {
        return [
            {
                indices: [offset, substr.length + offset - 1],
                type: AttributedTextType.Text,
                substr: substr,
            },
        ]
    }
    return fillEntitySequenceWithTextEntities(substr, sequence, offset)
}

// サーバー側でentityに変換されなかったものが対象
const splitTextIntoEntitiesByUrlString = (substr: string, offset: number): AttributedText[] => {
    if (substr.indexOf("http") === -1) {
        return [
            {
                indices: [offset, substr.length + offset - 1],
                type: AttributedTextType.Text,
                substr: substr,
            },
        ]
    }
    const base = "https?:\\/\\/[^\\s　]+.[^\\s　]+"
    const pattern = new RegExp(
        `^${base}(?=\\s)|(?<=\\s)${base}(?=\\s)|(?<=\\s)${base}$|^${base}$`,
        "gm"
    )
    const sequnce: AttributedText[] = []
    let match
    while ((match = pattern.exec(substr))) {
        const urlString = match[0]
        const startIndex = match.index
        const endIndex = startIndex + urlString.length - 1
        sequnce.push({
            type: AttributedTextType.UrlText,
            indices: [startIndex + offset, endIndex + offset],
            substr: urlString,
        })
    }
    if (sequnce.length === 0) {
        return [
            {
                indices: [offset, substr.length + offset - 1],
                type: AttributedTextType.Text,
                substr: substr,
            },
        ]
    }
    return fillEntitySequenceWithTextEntities(substr, sequnce, offset)
}

// sequenceの中のindicesが最初から最後まで繋がるように隙間を埋める
const fillEntitySequenceWithTextEntities = (
    substr: string,
    inputSequence: AttributedText[],
    offset: number
): AttributedText[] => {
    const outputSequence: AttributedText[] = []
    if (inputSequence.length === 0) {
        outputSequence.push({
            indices: [offset, substr.length + offset - 1],
            type: AttributedTextType.Text,
            substr: substr,
        })
        return outputSequence
    }
    inputSequence.sort(compareEntitySequence)
    let textCursor = 0
    let entitySequenceIndex = 0
    do {
        const entity = inputSequence[entitySequenceIndex]
        const entityStartPos = entity.indices[0] - offset
        const entityEndPos = entity.indices[1] - offset
        if (textCursor < entityStartPos) {
            outputSequence.push({
                indices: [textCursor + offset, entity.indices[0] - 1],
                type: AttributedTextType.Text,
                substr: substr.substring(textCursor, entityStartPos),
            })
            outputSequence.push(entity)
            textCursor = entityEndPos + 1
            entitySequenceIndex += 1
        } else {
            outputSequence.push(entity)
            textCursor = entityEndPos + 1
            entitySequenceIndex += 1
        }
        if (inputSequence.length <= entitySequenceIndex) {
            const restLength = substr.length - textCursor
            if (restLength > 0) {
                outputSequence.push({
                    indices: [textCursor + offset, substr.length + offset - 1],
                    type: AttributedTextType.Text,
                    substr: substr.substring(textCursor, substr.length),
                })
            }
            break
        }
    } while (textCursor < substr.length)
    return outputSequence
}

const applySplitOperatorToTextEntities = (
    inputSequence: AttributedText[],
    splitFunc: (substr: string, offset: number) => AttributedText[]
): AttributedText[] => {
    let outputSequence: AttributedText[] = []
    inputSequence.forEach((entity) => {
        if (entity.type === AttributedTextType.Text) {
            const offset = entity.indices[0]
            const seq = splitFunc(entity.substr, offset)
            outputSequence = outputSequence.concat(seq)
            return
        }
        outputSequence.push(entity)
    })
    return outputSequence
}

export const splitTextIntoAtributedTextSequence = (
    text: string,
    entities: MessageObjectT["entities"]
): AttributedText[] => {
    if (text.length === 0) {
        return []
    }
    const temp: AttributedText[] = []
    const { channels } = entities
    channels.forEach((entity) => {
        if (Array.isArray(entity.indices) && entity.indices.length === 2) {
            const { channel } = entity
            if (channel) {
                temp.push(
                    Object.assign(
                        {
                            type: AttributedTextType.Channel,
                            substr: text.substring(entity.indices[0], entity.indices[1] + 1),
                        },
                        entity
                    )
                )
            }
        }
    })
    const { messages: statuses } = entities
    statuses.forEach((entity) => {
        if (Array.isArray(entity.indices) && entity.indices.length === 2) {
            const { message: status } = entity
            if (status) {
                temp.push(
                    Object.assign(
                        {
                            type: AttributedTextType.Status,
                            substr: text.substring(entity.indices[0], entity.indices[1] + 1),
                        },
                        entity
                    )
                )
            }
        }
    })
    let sequence: AttributedText[]
    if (temp.length === 0) {
        sequence = [
            {
                indices: [0, text.length - 1],
                type: AttributedTextType.Text,
                substr: text,
            },
        ]
    } else {
        temp.sort(compareEntitySequence)
        sequence = fillEntitySequenceWithTextEntities(text, temp, 0)
    }
    const mk = config.markdown

    // 複数行にわたるmarkdownを先に処理
    if (text.indexOf(mk.code) !== -1) {
        sequence = applySplitOperatorToTextEntities(
            sequence,
            splitTextIntoEntitiesByMultiLineMarkdown
        )
    }

    // 改行を処理
    sequence = applySplitOperatorToTextEntities(sequence, splitTextIntoEntitiesByLineBreaks)

    const pattern_markdown = new RegExp(
        `${e(mk.big)}|${e(mk.bold)}|${e(mk.inlineCode)}|${e(mk.italic)}|${e(mk.strikethrough)}|${e(
            mk.underline
        )}`
    )
    if (text.match(pattern_markdown)) {
        sequence = splitInlineMarkdownIntoEntitySequence(sequence)
    }
    sequence = applySplitOperatorToTextEntities(sequence, splitTextIntoEntitiesByUrlString)
    return mergeattributedTextSequcne(sequence)
}

const mergeattributedTextSequcne = (sequence: AttributedText[]) => {
    const ret: AttributedText[] = []
    let textEntities: AttributedText[] = []
    sequence.forEach((attributedText) => {
        if (attributedText.type === AttributedTextType.Text) {
            textEntities.push(attributedText)
            return
        }
        if (attributedText.type === AttributedTextType.LineBreak) {
            textEntities.push(attributedText)
            return
        }
        if (textEntities.length > 0) {
            ret.push(makeTextEntityFromEntities(textEntities))
            textEntities = []
        }
        ret.push(attributedText)
    })
    if (textEntities.length > 0) {
        ret.push(makeTextEntityFromEntities(textEntities))
    }
    return ret
}

const makeTextEntityFromEntities = (sequence: AttributedText[]) => {
    const indicesStart = sequence[0].indices[0]
    const indicesEnd = sequence[sequence.length - 1].indices[1]
    let substr = ""
    sequence.map((attributedText) => (substr += attributedText.substr))
    return {
        indices: [indicesStart, indicesEnd],
        type: AttributedTextType.Text,
        substr: substr,
    }
}

export const convertAttributedTextSequenceToRPN = (sequence: AttributedText[]) => {
    const stack: AttributedText[] = []
    const buffer: AttributedText[] = []
    sequence.forEach((attributedText) => {
        if (isAttributeTextMarkdown(attributedText.type)) {
            buffer.push(attributedText)
            return
        }
        if (attributedText.type === AttributedTextType.NOP) {
            return
        }
        if (
            attributedText.type === AttributedTextType.Text ||
            attributedText.type === AttributedTextType.MarkdownCodeInnerText
        ) {
            stack.push(attributedText)
            while (buffer.length > 0) {
                stack.push(buffer.pop())
            }
            return
        }
        stack.push(attributedText)
    })
    return stack
}
