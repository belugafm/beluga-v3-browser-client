import {
    ChannelObjectT,
    CommunityObjectT,
    StatusObjectT,
    UserObjectT,
} from "../../../../api/object"
import { Dispatch, SetStateAction } from "react"

export type DomainDataT = {
    statuses: ObjectMap<StatusObjectT>
    users: ObjectMap<UserObjectT>
    channels: ObjectMap<ChannelObjectT>
    communities: ObjectMap<CommunityObjectT>
    mutedUserIds: StringSet
    blockedUserIds: StringSet
}

export type DomainDataSetActionT = {
    setStatuses: Dispatch<SetStateAction<ObjectMap<StatusObjectT>>>
    setUsers: Dispatch<SetStateAction<ObjectMap<UserObjectT>>>
    setChannels: Dispatch<SetStateAction<ObjectMap<ChannelObjectT>>>
    setCommunities: Dispatch<SetStateAction<ObjectMap<CommunityObjectT>>>
    setMutedUserIds: Dispatch<SetStateAction<StringSet>>
    setBlockedUserIds: Dispatch<SetStateAction<StringSet>>
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
                // authUserの操作による更新を検出
                if (a.muted !== b.muted) {
                    throw new Error()
                }
                if (a.blocked !== b.blocked) {
                    throw new Error()
                }
                if (a.favorited !== b.favorited) {
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
