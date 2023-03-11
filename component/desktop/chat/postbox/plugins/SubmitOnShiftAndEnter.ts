import { useEffect } from "react"

export function SubmitOnShiftAndEnterPlugin() {
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
