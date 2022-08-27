/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import * as React from "react"

type DropDownContextType = {
    registerItem: (ref: React.RefObject<HTMLButtonElement>) => void
}

const DropDownContext = React.createContext<DropDownContextType | null>(null)

export function DropDownItem({
    children,
    className,
    onClick,
    title,
}: {
    children: React.ReactNode
    className: string
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
    title?: string
}) {
    const ref = useRef<HTMLButtonElement>(null)

    const dropDownContext = useContext(DropDownContext)

    if (dropDownContext === null) {
        throw new Error("DropDownItem must be used within a DropDown")
    }

    const { registerItem } = dropDownContext

    useEffect(() => {
        if (ref && ref.current) {
            registerItem(ref)
        }
    }, [ref, registerItem])

    return (
        <button className={className} onClick={onClick} ref={ref} title={title}>
            {children}
        </button>
    )
}

export function DropDownItems({
    children,
    dropDownRef,
    onClose,
}: {
    children: React.ReactNode
    dropDownRef: React.Ref<HTMLDivElement>
    onClose: () => void
}) {
    const [items, setItems] = useState<React.RefObject<HTMLButtonElement>[]>()
    const [highlightedItem, setHighlightedItem] = useState<React.RefObject<HTMLButtonElement>>()

    const registerItem = useCallback(
        (itemRef: React.RefObject<HTMLButtonElement>) => {
            setItems((prev) => (prev ? [...prev, itemRef] : [itemRef]))
        },
        [setItems]
    )

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (!items) return

        const key = event.key

        if (["Escape", "ArrowUp", "ArrowDown", "Tab"].includes(key)) {
            event.preventDefault()
        }

        if (key === "Escape" || key === "Tab") {
            onClose()
        } else if (key === "ArrowUp") {
            setHighlightedItem((prev) => {
                if (!prev) return items[0]
                const index = items.indexOf(prev) - 1
                return items[index === -1 ? items.length - 1 : index]
            })
        } else if (key === "ArrowDown") {
            setHighlightedItem((prev) => {
                if (!prev) return items[0]
                return items[items.indexOf(prev) + 1]
            })
        }
    }

    const contextValue = useMemo(
        () => ({
            registerItem,
        }),
        [registerItem]
    )

    useEffect(() => {
        if (items && !highlightedItem) {
            setHighlightedItem(items[0])
        }

        if (highlightedItem && highlightedItem.current) {
            highlightedItem.current.focus()
        }
    }, [items, highlightedItem])

    return (
        <DropDownContext.Provider value={contextValue}>
            <div className="dropdown" ref={dropDownRef} onKeyDown={handleKeyDown}>
                {children}
            </div>
            <style jsx global>{`
                .dropdown {
                    z-index: 10;
                    display: block;
                    position: fixed;
                    box-shadow: 0 12px 28px 0 rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.1),
                        inset 0 0 0 1px rgba(255, 255, 255, 0.5);
                    border-radius: 8px;
                    min-height: 40px;
                    background-color: #fff;
                }
            `}</style>
        </DropDownContext.Provider>
    )
}
