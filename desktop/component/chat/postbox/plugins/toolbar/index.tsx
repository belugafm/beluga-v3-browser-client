import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils"
import {
    $getNodeByKey,
    $getSelection,
    $isRangeSelection,
    CAN_REDO_COMMAND,
    CAN_UNDO_COMMAND,
    FORMAT_TEXT_COMMAND,
    REDO_COMMAND,
    SELECTION_CHANGE_COMMAND,
    UNDO_COMMAND,
} from "lexical"
import { $isCodeNode, getCodeLanguages, getDefaultCodeLanguage } from "@lexical/code"
import { $isListNode, ListNode } from "@lexical/list"
import { Themes, useTheme } from "../../../../theme"
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"

import { $isAtNodeEnd } from "@lexical/selection"
import { $isHeadingNode } from "@lexical/rich-text"
import { BlockOptionsDropdownList } from "./block_dropdown"
import { Select } from "./select_language"
import { TooltipActionContext } from "../../../../../state/component/tooltip"
import classNames from "classnames"
import { createPortal } from "react-dom"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"

const getStyleForEditorButton = (theme: Themes) => {
    if (theme.global.current.light) {
        return {
            fill: "#6f767d",
            hoverFill: "#1a1d1f",
            backgroundColor: "#fafafa",
            hoverBackgroundColor: "#efefef",
        }
    }
    if (theme.global.current.dark) {
        return {
            fill: "#616d78",
            hoverFill: "#fcfcfc",
            backgroundColor: "#0d0e10",
            hoverBackgroundColor: "#1f2327",
        }
    }
    throw new Error()
}

const getStyleForDivider = (theme: Themes) => {
    if (theme.global.current.light) {
        return {
            color: "#dcdcdc",
        }
    }
    if (theme.global.current.dark) {
        return {
            color: "#2f363c",
        }
    }
    throw new Error()
}

const getStyleForToolbar = (theme: Themes) => {
    if (theme.global.current.light) {
        return {
            backgroundColor: "#fafafa",
        }
    }
    if (theme.global.current.dark) {
        return {
            backgroundColor: "#0d0e10",
        }
    }
    throw new Error()
}

const LowPriority = 1

const supportedBlockTypes = new Set(["paragraph", "quote", "code", "h1", "h2", "ul", "ol"])

const blockTypeToBlockName = {
    code: "コードブロック",
    h1: "見出し1",
    h2: "見出し2",
    h3: "Heading",
    h4: "Heading",
    h5: "Heading",
    ol: "リスト（数字）",
    paragraph: "テキスト",
    quote: "引用",
    ul: "リスト",
}

function Divider({ theme }: { theme: Themes }) {
    return (
        <>
            <div className="divider" />
            <style jsx>{`
                .divider {
                    width: 1px;
                    margin: 8px 6px;
                    background-color: ${getStyleForDivider(theme)["color"]};
                }
            `}</style>
        </>
    )
}

export function ToolbarPlugin({ hidden }: { hidden: boolean }) {
    const [editor] = useLexicalComposerContext()
    const tooltipAction = useContext(TooltipActionContext)
    const [theme] = useTheme()
    const toolbarRef = useRef(null)
    const [canUndo, setCanUndo] = useState(false)
    const [canRedo, setCanRedo] = useState(false)
    const [blockType, setBlockType] = useState("paragraph")
    const [selectedElementKey, setSelectedElementKey] = useState(null)
    const [showBlockOptionsDropDown, setShowBlockOptionsDropDown] = useState(false)
    const [codeLanguage, setCodeLanguage] = useState("")
    const [isBold, setIsBold] = useState(false)
    const [isItalic, setIsItalic] = useState(false)
    const [isUnderline, setIsUnderline] = useState(false)
    const [isStrikethrough, setIsStrikethrough] = useState(false)
    const [isCode, setIsCode] = useState(false)

    const updateToolbar = useCallback(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
            const anchorNode = selection.anchor.getNode()
            const element =
                anchorNode.getKey() === "root" ? anchorNode : anchorNode.getTopLevelElementOrThrow()
            const elementKey = element.getKey()
            const elementDOM = editor.getElementByKey(elementKey)
            if (elementDOM !== null) {
                setSelectedElementKey(elementKey)
                if ($isListNode(element)) {
                    const parentList = $getNearestNodeOfType(anchorNode, ListNode)
                    const type = parentList ? parentList.getTag() : element.getTag()
                    setBlockType(type)
                } else {
                    const type = $isHeadingNode(element) ? element.getTag() : element.getType()
                    setBlockType(type)
                    if ($isCodeNode(element)) {
                        setCodeLanguage(element.getLanguage() || getDefaultCodeLanguage())
                    }
                }
            }
            // Update text format
            setIsBold(selection.hasFormat("bold"))
            setIsItalic(selection.hasFormat("italic"))
            setIsUnderline(selection.hasFormat("underline"))
            setIsStrikethrough(selection.hasFormat("strikethrough"))
            setIsCode(selection.hasFormat("code"))
        }
    }, [editor])

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    updateToolbar()
                })
            }),
            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                (_payload, newEditor) => {
                    updateToolbar()
                    return false
                },
                LowPriority
            ),
            editor.registerCommand(
                CAN_UNDO_COMMAND,
                (payload) => {
                    setCanUndo(payload)
                    return false
                },
                LowPriority
            ),
            editor.registerCommand(
                CAN_REDO_COMMAND,
                (payload) => {
                    setCanRedo(payload)
                    return false
                },
                LowPriority
            )
        )
    }, [editor, updateToolbar])

    const codeLanguges = useMemo(() => getCodeLanguages(), [])
    const onCodeLanguageSelect = useCallback(
        (e) => {
            editor.update(() => {
                if (selectedElementKey !== null) {
                    const node = $getNodeByKey(selectedElementKey)
                    if ($isCodeNode(node)) {
                        node.setLanguage(e.target.value)
                    }
                }
            })
        },
        [editor, selectedElementKey]
    )

    if (hidden) {
        return null
    }
    return (
        <div className="text-attribute-block">
            <button
                disabled={!canUndo}
                className={classNames("editor-button undo", {
                    active: isBold,
                })}
                onMouseEnter={(e) => tooltipAction.show(e, "戻す")}
                onMouseLeave={() => tooltipAction.hide()}
                onClick={() => {
                    editor.dispatchCommand(UNDO_COMMAND)
                }}>
                <svg className="icon">
                    <use href="#icon-editor-undo"></use>
                </svg>
            </button>
            <button
                disabled={!canRedo}
                className={classNames("editor-button redo", {
                    active: isBold,
                })}
                onMouseEnter={(e) => tooltipAction.show(e, "やり直す")}
                onMouseLeave={() => tooltipAction.hide()}
                onClick={() => {
                    editor.dispatchCommand(REDO_COMMAND)
                }}>
                <svg className="icon">
                    <use href="#icon-editor-redo"></use>
                </svg>
            </button>
            <Divider theme={theme} />
            {supportedBlockTypes.has(blockType) && (
                <>
                    <button
                        className={`editor-button block-controls ${blockType}`}
                        onClick={() => setShowBlockOptionsDropDown(!showBlockOptionsDropDown)}
                        ref={toolbarRef}>
                        <svg className="icon current-state">
                            <use href={`#icon-editor-${blockType}`}></use>
                        </svg>
                        <span className="text">{blockTypeToBlockName[blockType]}</span>
                        <svg className="icon down">
                            <use href="#icon-direction-down"></use>
                        </svg>
                    </button>
                    {showBlockOptionsDropDown &&
                        createPortal(
                            <BlockOptionsDropdownList
                                theme={theme}
                                editor={editor}
                                blockType={blockType}
                                toolbarRef={toolbarRef}
                                setShowBlockOptionsDropDown={setShowBlockOptionsDropDown}
                            />,
                            document.body
                        )}
                    <Divider theme={theme} />
                </>
            )}
            {blockType === "code" ? (
                <>
                    <Select
                        className="toolbar-item code-language"
                        onChange={onCodeLanguageSelect}
                        options={codeLanguges}
                        value={codeLanguage}
                        theme={theme}
                    />
                    <i className="chevron-down inside" />
                </>
            ) : (
                <>
                    <button
                        className={classNames("editor-button format bold", {
                            active: isBold,
                        })}
                        onMouseEnter={(e) => tooltipAction.show(e, "太字")}
                        onMouseLeave={() => tooltipAction.hide()}
                        onClick={() => {
                            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")
                        }}>
                        <svg className="icon">
                            <use href="#icon-editor-bold"></use>
                        </svg>
                    </button>
                    <button
                        className={classNames("editor-button format italic", {
                            active: isItalic,
                        })}
                        onMouseEnter={(e) => tooltipAction.show(e, "イタリック体")}
                        onMouseLeave={() => tooltipAction.hide()}
                        onClick={() => {
                            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")
                        }}>
                        <svg className="icon">
                            <use href="#icon-editor-italic"></use>
                        </svg>
                    </button>
                    <button
                        className={classNames("editor-button format strikethrough", {
                            active: isStrikethrough,
                        })}
                        onMouseEnter={(e) => tooltipAction.show(e, "打ち消し線")}
                        onMouseLeave={() => tooltipAction.hide()}
                        onClick={() => {
                            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")
                        }}>
                        <svg className="icon">
                            <use href="#icon-editor-strikethrough"></use>
                        </svg>
                    </button>
                    <button
                        className={classNames("editor-button format underline", {
                            active: isUnderline,
                        })}
                        onMouseEnter={(e) => tooltipAction.show(e, "下線")}
                        onMouseLeave={() => tooltipAction.hide()}
                        onClick={() => {
                            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")
                        }}>
                        <svg className="icon">
                            <use href="#icon-editor-underline"></use>
                        </svg>
                    </button>
                    <button
                        className={classNames("editor-button format code", {
                            active: isCode,
                        })}
                        onMouseEnter={(e) => tooltipAction.show(e, "コード")}
                        onMouseLeave={() => tooltipAction.hide()}
                        onClick={() => {
                            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code")
                        }}>
                        <svg className="icon">
                            <use href="#icon-editor-code"></use>
                        </svg>
                    </button>
                    <button
                        className="editor-button palette"
                        onMouseEnter={(e) => tooltipAction.show(e, "文字色")}
                        onMouseLeave={() => tooltipAction.hide()}>
                        <svg className="icon">
                            <use href="#icon-editor-palette"></use>
                        </svg>
                    </button>
                </>
            )}
            <style jsx>{`
                .text-attribute-block {
                    display: flex;
                    flex-direction: row;
                    padding: 4px;
                }
                .text-attribute-block.hidden {
                    display: none;
                }
                .editor-button {
                    cursor: pointer;
                    width: 32px;
                    height: 32px;
                    border-radius: 6px;
                    outline: none;
                    border: none;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: center;
                    background-color: transparent;
                    transition: 0.05s;
                }
                .editor-button > .icon {
                    width: 18px;
                    height: 18px;
                    text-align: center;
                    flex-shrink: 0;
                }
                .editor-button.bold > .icon {
                    stroke-width: 1px;
                }
                .editor-button.strikethrough > .icon {
                    width: 20px;
                    height: 20px;
                }
                .editor-button.underline > .icon {
                    width: 20px;
                    height: 20px;
                }
                .editor-button.italic > .icon {
                    width: 20px;
                    height: 20px;
                }
                .editor-button:disabled {
                    cursor: not-allowed;
                }
                .editor-button:disabled > .icon {
                    opacity: 0.2;
                }
                .block-controls {
                    width: auto;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    font-size: 14px;
                    line-height: 14px;
                }
                .block-controls > .icon {
                    width: 18px;
                    height: 18px;
                    margin: 0 4px;
                }
            `}</style>
            <style jsx>{`
                .text-attribute-block {
                    background-color: ${getStyleForToolbar(theme)["backgroundColor"]};
                }
                .editor-button {
                    color: ${getStyleForEditorButton(theme)["fill"]};
                    fill: ${getStyleForEditorButton(theme)["fill"]};
                    background-color: ${getStyleForEditorButton(theme)["backgroundColor"]};
                }
                .editor-button.format.active,
                .editor-button:hover {
                    color: ${getStyleForEditorButton(theme)["hoverFill"]};
                    fill: ${getStyleForEditorButton(theme)["hoverFill"]};
                    background-color: ${getStyleForEditorButton(theme)["hoverBackgroundColor"]};
                }
                .editor-button.bold,
                .editor-button.paragraph,
                .editor-button.strikethrough {
                    stroke: ${getStyleForEditorButton(theme)["fill"]};
                }
                .editor-button.bold:hover,
                .editor-button.paragraph:hover,
                .editor-button.strikethrough:hover {
                    stroke: ${getStyleForEditorButton(theme)["hoverFill"]};
                }
            `}</style>
        </div>
    )
}
