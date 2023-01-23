import { AppStateT, ContentStateT } from "../types/app_state"

export const findContentInAppState = (
    nextAppState: AppStateT,
    prevContent: ContentStateT
): ContentStateT | null => {
    for (const column of nextAppState.contents) {
        for (const nextCntent of column) {
            if (nextCntent.id == prevContent.id) {
                return nextCntent
            }
        }
    }
    return null
}
