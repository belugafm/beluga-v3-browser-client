import {
    StatusObjectT,
    UserObjectT,
    ChannelObjectT,
    CommunityObjectT,
} from "../../../../api/object"

export type DomainDataT = {
    statuses: ObjectMap<StatusObjectT>
    users: ObjectMap<UserObjectT>
    channels: ObjectMap<ChannelObjectT>
    communities: ObjectMap<CommunityObjectT>
    mutedUserIds: StringSet
    blockedUserIds: StringSet
}

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

export class ObjectMap<T> {
    data: Map<string, T> = new Map()
    lastModified: number = Date.now()
    updatedKeys: Set<string> = new Set()
    get(key: string): T | null {
        return this.data[key]
    }
    set(key: string, value: T) {
        this.data[key] = value
    }
    update(key: string, value: T) {
        this.data[key] = value
        this.updatedKeys.add(key)
    }
    equals(target: ObjectMap<T>): boolean {
        if (this.updatedKeys.size === 0) {
            return true
        }
        try {
            this.updatedKeys.forEach((key) => {
                const a = this.data[key]
                const b = target.data[key]
                if (b == null) {
                    throw new Error()
                }
                if (getUpdateTime(a) !== getUpdateTime(b)) {
                    throw new Error()
                }
            })
        } catch (error) {
            return false
        }
        return true
    }
}

export class StringSet extends Set<string> {
    equals(target: StringSet) {
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
