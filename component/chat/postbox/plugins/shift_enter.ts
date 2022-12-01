import { useEffect, useState } from "react"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { KEY_ENTER_COMMAND, KEY_MODIFIER_COMMAND } from "lexical"

export function SubmitOnShiftAndEnterPlugin() {
    const contextKeys = ["shift", "control"]
    const [contextKeyIsDown, setContextKeyIsDown] = useState(false)
    useEffect(() => {
        window.addEventListener("keyup", (e) => {
            console.log("up", e)
        })
        window.addEventListener("keydown", (e) => {
            console.log("down", e)
        })
    }, [window])
    return null
}
