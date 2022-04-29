import {
    ChannelGroupObjectT,
    ChannelObjectT,
    MessageObjectT,
    UserObjectT,
} from "../../../../api/object"
import { Dispatch, SetStateAction } from "react"

import deepEqual from "deep-equal"

export type DomainDataT = {
    messages: ObjectMap<MessageObjectT>
    users: ObjectMap<UserObjectT>
    channels: ObjectMap<ChannelObjectT>
    channelGroups: ObjectMap<ChannelGroupObjectT>
    mutedUserIds: UserIdSet
    blockedUserIds: UserIdSet
}

export type DomainDataSetActionT = {
    setMessages: Dispatch<SetStateAction<ObjectMap<MessageObjectT>>>
    setUsers: Dispatch<SetStateAction<ObjectMap<UserObjectT>>>
    setChannels: Dispatch<SetStateAction<ObjectMap<ChannelObjectT>>>
    setChannelGroups: Dispatch<SetStateAction<ObjectMap<ChannelGroupObjectT>>>
    setMutedUserIds: Dispatch<SetStateAction<UserIdSet>>
    setBlockedUserIds: Dispatch<SetStateAction<UserIdSet>>
}

// メッセージ
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

// チャンネル
function readStateEquals(a: any, b: any): boolean {
    if (a.read_state == null && b.read_state == null) {
        return true
    }
    if (a.last_message == null && b.last_message == null) {
        return true
    }
    if (a.last_messag_id !== b.last_message_id) {
        return false
    }
    if (a.read_state.last_messag_id !== b.read_state.last_message_id) {
        return false
    }
    return true
}

export class ObjectMap<T> {
    data: Map<number, T> = new Map()
    lastModified: number = Date.now()
    updatedKeys: Set<number> = new Set()
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
                if (getUpdateTime(a) !== getUpdateTime(b)) {
                    throw new Error()
                }
                if (readStateEquals(a, b) == false) {
                    throw new Error()
                }
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
