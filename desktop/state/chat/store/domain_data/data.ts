import { ChannelObjectT, MessageObjectT, UserObjectT } from "../../../../api/object"

function getUpdateTime(a: any): number {
    const { updated_at, last_activity_time } = a
    if (updated_at) {
        return updated_at
    }
    if (last_activity_time) {
        return last_activity_time
    }
    return -1
}

export function immutableCompareFunction<T>(a: T, b: T): boolean {
    return true
}

export function messageCompareFunction<T extends MessageObjectT>(a: T, b: T): boolean {
    // 高速化のため完全な比較はしない
    return a._internal_updated_at == b._internal_updated_at
}

export function userCompareFunction<T extends UserObjectT>(a: T, b: T): boolean {
    return true
}

export function channelCompareFunction<T extends ChannelObjectT>(a: T, b: T): boolean {
    if (a.last_message_id !== b.last_message_id) {
        return false
    }
    if (a.read_state !== b.read_state) {
        return false
    }
    if (a.read_state && b.read_state) {
        if (a.read_state.last_message_id !== b.read_state.last_message_id) {
            return false
        }
    }
    if (a.status_string !== b.status_string) {
        return false
    }
    if (a.name !== b.name) {
        return false
    }
    if (a.description !== b.description) {
        return false
    }
    return true
}

export class ObjectMap<T> {
    data: Map<number, T> = new Map()
    lastModified: number = Date.now()
    updatedKeys: Set<number> = new Set()
    compareFunction: (a: T, b: T) => boolean
    constructor(compareFunction: (a: T, b: T) => boolean) {
        this.compareFunction = compareFunction
    }
    get(key: number): T | null {
        return this.data.get(key)
    }
    set(key: number, value: T) {
        this.data.set(key, value)
    }
    update(key: number, value: T) {
        this.data.set(key, value)
        this.updatedKeys.add(key)
    }
    equals(target: ObjectMap<T>): boolean {
        if (this.updatedKeys.size === 0) {
            return true
        }
        try {
            this.updatedKeys.forEach((key) => {
                const a = this.data.get(key)
                const b = target.data.get(key)
                if (b == null) {
                    throw new Error()
                }
                if (this.compareFunction(a, b) == false) {
                    throw new Error()
                }
                // if (getUpdateTime(a) !== getUpdateTime(b)) {
                //     throw new Error()
                // }
                // if (readStateEquals(a, b) == false) {
                //     throw new Error()
                // }
                // authUserの操作による更新を検出
                // if (a.muted !== b.muted) {
                //     throw new Error()
                // }
                // if (a.blocked !== b.blocked) {
                //     throw new Error()
                // }
                // if (a.favorited !== b.favorited) {
                //     throw new Error()
                // }
            })
        } catch (error) {
            return false
        }
        return true
    }
}

export class UserIdSet extends Set<number> {
    equals(target: UserIdSet) {
        let ok = true
        this.forEach((id) => {
            if (target.has(id) === false) {
                ok = false
            }
        })
        target.forEach((id) => {
            if (this.has(id) === false) {
                ok = false
            }
        })
        return ok
    }
}
