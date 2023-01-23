import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text"
import { $createParagraphNode, $getSelection, $isRangeSelection } from "lexical"
import {
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
    REMOVE_LIST_COMMAND,
} from "@lexical/list"
import { useEffect, useRef } from "react"

import { $createCodeNode } from "@lexical/code"
import { $wrapLeafNodesInElements } from "@lexical/selection"
import { ThemeT } from "../../../../theme"

const getStyle = (theme: ThemeT) => {
    if (theme.global.current.light) {
        return {
            color: "#000",
            hoverColor: "#000",
            borderColor: "#d8dadc",
            backgroundColor: "#fff",
            hoverBackgroundColor: "#f4f4f4",
            boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px;",
        }
    }
    if (theme.global.current.dark) {
        return {
            color: "#fff",
            hoverColor: "#fff",
            borderColor: "#323232",
            backgroundColor: "#0f0f0f",
            hoverBackgroundColor: "#242424",
            boxShadow: "rgba(0, 0, 0, 0.2) 0px 8px 24px;",
        }
    }
    throw new Error()
}

export function BlockOptionsDropdownList({
    editor,
    blockType,
    toolbarRef,
    setShowBlockOptionsDropDown,
    theme,
}) {
    const dropDownRef = useRef(null)

    useEffect(() => {
        const toolbar = toolbarRef.current
        const dropDown = dropDownRef.current

        if (toolbar !== null && dropDown !== null) {
            const { height, width } = dropDown.getBoundingClientRect()
            const { top, left } = toolbar.getBoundingClientRect()
            dropDown.style.top = `${top - height}px`
            dropDown.style.left = `${left}px`
        }
    }, [dropDownRef, toolbarRef])

    useEffect(() => {
        const dropDown = dropDownRef.current
        const toolbar = toolbarRef.current

        if (dropDown !== null && toolbar !== null) {
            const handle = (event) => {
                const target = event.target

                if (!dropDown.contains(target) && !toolbar.contains(target)) {
                    setShowBlockOptionsDropDown(false)
                }
            }
            document.addEventListener("click", handle)

            return () => {
                document.removeEventListener("click", handle)
            }
        }
    }, [dropDownRef, setShowBlockOptionsDropDown, toolbarRef])

    const formatParagraph = () => {
        if (blockType !== "paragraph") {
            editor.update(() => {
                const selection = $getSelection()

                if ($isRangeSelection(selection)) {
                    $wrapLeafNodesInElements(selection, () => $createParagraphNode())
                }
            })
        }
        setShowBlockOptionsDropDown(false)
    }

    const formatLargeHeading = () => {
        if (blockType !== "h1") {
            editor.update(() => {
                const selection = $getSelection()

                if ($isRangeSelection(selection)) {
                    $wrapLeafNodesInElements(selection, () => $createHeadingNode("h1"))
                }
            })
        }
        setShowBlockOptionsDropDown(false)
    }

    const formatSmallHeading = () => {
        if (blockType !== "h2") {
            editor.update(() => {
                const selection = $getSelection()

                if ($isRangeSelection(selection)) {
                    $wrapLeafNodesInElements(selection, () => $createHeadingNode("h2"))
                }
            })
        }
        setShowBlockOptionsDropDown(false)
    }

    const formatBulletList = () => {
        if (blockType !== "ul") {
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND)
        } else {
            editor.dispatchCommand(REMOVE_LIST_COMMAND)
        }
        setShowBlockOptionsDropDown(false)
    }

    const formatNumberedList = () => {
        if (blockType !== "ol") {
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND)
        } else {
            editor.dispatchCommand(REMOVE_LIST_COMMAND)
        }
        setShowBlockOptionsDropDown(false)
    }

    const formatQuote = () => {
        if (blockType !== "quote") {
            editor.update(() => {
                const selection = $getSelection()

                if ($isRangeSelection(selection)) {
                    $wrapLeafNodesInElements(selection, () => $createQuoteNode())
                }
            })
        }
        setShowBlockOptionsDropDown(false)
    }

    const formatCode = () => {
        if (blockType !== "code") {
            editor.update(() => {
                const selection = $getSelection()

                if ($isRangeSelection(selection)) {
                    $wrapLeafNodesInElements(selection, () => $createCodeNode())
                }
            })
        }
        setShowBlockOptionsDropDown(false)
    }

    return (
        <>
            <div className="dropdown" ref={dropDownRef}>
                <button className="item" onClick={formatParagraph}>
                    <svg className="icon paragraph">
                        <use href="#icon-editor-paragraph"></use>
                    </svg>
                    <span className="text">テキスト</span>
                    {blockType === "paragraph" && <span className="active" />}
                </button>
                <button className="item" onClick={formatLargeHeading}>
                    <svg className="icon">
                        <use href="#icon-editor-h1"></use>
                    </svg>
                    <span className="text">見出し1</span>
                    {blockType === "h1" && <span className="active" />}
                </button>
                <button className="item" onClick={formatSmallHeading}>
                    <svg className="icon">
                        <use href="#icon-editor-h2"></use>
                    </svg>
                    <span className="text">見出し2</span>
                    {blockType === "h2" && <span className="active" />}
                </button>
                <button className="item" onClick={formatBulletList}>
                    <svg className="icon">
                        <use href="#icon-editor-ul"></use>
                    </svg>
                    <span className="text">リスト</span>
                    {blockType === "ul" && <span className="active" />}
                </button>
                <button className="item" onClick={formatQuote}>
                    <svg className="icon">
                        <use href="#icon-editor-quote"></use>
                    </svg>
                    <span className="text">引用</span>
                    {blockType === "quote" && <span className="active" />}
                </button>
                <button className="item" onClick={formatCode}>
                    <svg className="icon">
                        <use href="#icon-editor-code"></use>
                    </svg>
                    <span className="text">コードブロック</span>
                    {blockType === "code" && <span className="active" />}
                </button>
            </div>
            <style jsx>{`
                .dropdown {
                    z-index: 5;
                    display: block;
                    position: absolute;
                    border-radius: 8px;
                    min-width: 100px;
                    min-height: 40px;
                    border: 1px solid transparent;
                }
                .item {
                    margin: 0 8px 4px 8px;
                    padding: 8px;
                    cursor: pointer;
                    line-height: 16px;
                    font-size: 15px;
                    display: flex;
                    align-content: center;
                    align-items: center;
                    flex-direction: row;
                    flex-shrink: 0;
                    justify-content: space-between;
                    border-radius: 8px;
                    border: 0;
                    transition: 0.05s;
                }
                .item:first-child {
                    margin-top: 8px;
                }
                .item:last-child {
                    margin-bottom: 8px;
                }
                .item:hover {
                    background-color: #eee;
                }
                .text {
                    display: flex;
                    line-height: 0;
                    flex-grow: 1;
                    width: 180px;
                }
                .icon {
                    width: 18px;
                    height: 18px;
                    text-align: center;
                    flex-shrink: 0;
                    margin-right: 8px;
                }
            `}</style>
            <style jsx>{`
                .dropdown {
                    border-color: ${getStyle(theme)["borderColor"]};
                    background-color: ${getStyle(theme)["backgroundColor"]};
                    box-shadow: ${getStyle(theme)["boxShadow"]};
                }
                .item {
                    background-color: ${getStyle(theme)["backgroundColor"]};
                    color: ${getStyle(theme)["color"]};
                }
                .item:hover {
                    color: ${getStyle(theme)["hoverColor"]};
                    background-color: ${getStyle(theme)["hoverBackgroundColor"]};
                }
                .icon {
                    fill: ${getStyle(theme)["color"]};
                }
                .icon:hover {
                    fill: ${getStyle(theme)["hoverColor"]};
                }
                .icon.paragraph {
                    stroke: ${getStyle(theme)["color"]};
                }
                .icon.paragraph:hover {
                    stroke: ${getStyle(theme)["hoverColor"]};
                }
            `}</style>
        </>
    )
}
