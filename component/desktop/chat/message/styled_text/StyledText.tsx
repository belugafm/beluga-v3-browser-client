import {
    MessageEntityFileNode,
    MessageEntityStyleNode,
    MessageObjectT,
} from "../../../../../api/object"

import GraphemeSplitter from "grapheme-splitter"
import React from "react"
import { ThemeT } from "../../../../theme"
import { containsImageUrl } from "./ExternalImage"
import { containsUrl } from "./Link"
import { SearchTextComponent } from "./SearchText"
import { StyledInlineTextCompoment } from "./StyledInlineText"
import { QuoteComponent } from "./Quote"
import { Heading1Component } from "./Heading1"
import { Heading2Component } from "./Heading2"
import { CodeComponent } from "./Code"
import { ListComponent, ListItemComponent } from "./List"
import { ParagraphComponent } from "./Paragraph"
import { imageEntitiesToElements } from "./InternalImage"
import { PlainTextComponent } from "../plain_text/PlainText"

export const sliceText = (textGraphemes: string[], node: MessageEntityStyleNode) => {
    if (node.indices.length == 0) {
        return ""
    }
    const start = node.indices[0]
    const end = node.indices[1] + 1
    return textGraphemes.slice(start, end).join("")
}

export const styledNodeToElement = (
    textGraphemes: string[],
    node: MessageEntityStyleNode,
    theme: ThemeT
) => {
    if (node.type == "text") {
        const substr = sliceText(textGraphemes, node)
        if (containsImageUrl(substr) || containsUrl(substr)) {
            return <PlainTextComponent text={substr} theme={theme} />
        } else if (node.style && node.style.format != 0) {
            return <StyledInlineTextCompoment text={substr} node={node} theme={theme} />
        } else {
            return <SearchTextComponent text={substr} theme={theme} />
        }
    }
    const innerElements = node.children.map((child, index) => {
        const elem = styledNodeToElement(textGraphemes, child, theme)
        if (elem) {
            return React.cloneElement(elem, { key: index })
        } else {
            return null
        }
    })
    if (node.type == "paragraph") {
        return <ParagraphComponent>{innerElements}</ParagraphComponent>
    }
    if (node.type == "quote") {
        return <QuoteComponent theme={theme}>{innerElements}</QuoteComponent>
    }
    if (node.type == "heading_1") {
        return <Heading1Component>{innerElements}</Heading1Component>
    }
    if (node.type == "heading_2") {
        return <Heading2Component>{innerElements}</Heading2Component>
    }
    if (node.type == "code") {
        return <CodeComponent textGraphemes={textGraphemes} node={node} theme={theme} />
    }
    if (node.type == "list") {
        return <ListComponent>{innerElements}</ListComponent>
    }
    if (node.type == "listitem") {
        return <ListItemComponent node={node}>{innerElements}</ListItemComponent>
    }
    return null
}

const findFileEntitiesForTextNode = (
    node: MessageEntityStyleNode,
    files: MessageEntityFileNode[]
) => {
    for (const file of files) {
        if (node.indices[0] == file.indices[0] && node.indices[1] == file.indices[1]) {
            return file
        }
    }
    return null
}

export const StyledTextComponent = ({
    text,
    entities,
    theme,
}: {
    text: string
    entities: MessageObjectT["entities"]
    theme: ThemeT
}) => {
    const textGraphemes = new GraphemeSplitter().splitGraphemes(text)
    const elements = []
    const consecutiveImageEntityList = []
    entities.style.forEach((node: MessageEntityStyleNode, index: number) => {
        if (node.type == "paragraph") {
            if (node.children.length == 2 && node.children[0].type == "text") {
                const entity = findFileEntitiesForTextNode(node.children[0], entities["files"])
                if (entity && entity.file && ["png", "gif", "jpg"].includes(entity.file.type)) {
                    consecutiveImageEntityList.push(entity)
                    return
                }
            }
        }
        if (consecutiveImageEntityList.length > 0) {
            const elem = imageEntitiesToElements(consecutiveImageEntityList)
            elements.push(React.cloneElement(elem, { key: index - 1 }))
        }
        const elem = styledNodeToElement(textGraphemes, node, theme)
        elements.push(React.cloneElement(elem, { key: index }))
    })
    if (consecutiveImageEntityList.length > 0) {
        const elem = imageEntitiesToElements(consecutiveImageEntityList)
        elements.push(React.cloneElement(elem, { key: entities.style.length }))
    }
    return (
        <>
            {elements}
            <style jsx global>{``}</style>
        </>
    )
}
