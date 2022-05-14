export type UserObjectT = {
    id: number
    name: string
    display_name: string | null
    profile_image_url: string | null
    location: string | null
    url: string | null
    description: string | null
    created_at: Date
    message_count: number
    favorites_count: number
    favorited_count: number
    bot: boolean
    active: boolean
    dormant: boolean
    suspended: boolean
    muted: boolean
    blocked: boolean
    trust_level: number
    last_activity_date: Date | null
}

export type ChannelGroupObjectT = {
    id: number
    name: string
    unique_name: string
    description: string | null
    image_url: string | null
    created_at: Date
    created_by: number
    level: number
    channels_count: number
    statuses_count: number
    creator: UserObjectT | null
}

export type ChannelReadStateObjectT = {
    id: number
    channel_id: number
    user_id: number
    last_message_id: number | null
    last_message_created_at: number | null
    last_message: MessageObjectT | null
}

export type ChannelObjectT = {
    id: number
    name: string
    unique_name: string
    parent_channel_group_id: number
    parent_channel_group: ChannelGroupObjectT | null
    created_by: number
    created_at: Date
    message_count: number
    description: string
    status_string: string
    last_message_id: number | null
    last_message_created_at: number | null
    last_message: MessageObjectT | null
    read_state: ChannelReadStateObjectT | null
}

export const MessageEntityStyleFormat = {
    IS_BOLD: 1,
    IS_ITALIC: 1 << 1,
    IS_STRIKETHROUGH: 1 << 2,
    IS_UNDERLINE: 1 << 3,
    IS_CODE: 1 << 4,
    IS_SUBSCRIPT: 1 << 5,
    IS_SUPERSCRIPT: 1 << 6,
} as const

export type MessageEntityStyleNode = {
    children: MessageEntityStyleNode[]
    type: string
    style: {
        format: number
        color: string | null
    } | null
    indices: number[]
    text?: string
    language?: string
}

export type MessageObjectT = {
    id: number
    channel_id: number
    channel: ChannelObjectT | null
    user_id: number
    user: UserObjectT | null
    text: string | null
    created_at: Date
    favorite_count: number
    like_count: number
    reply_count: number
    thread_id: number | null
    deleted: boolean
    updated_at: number // for React
    entities: {
        channel_groups: {
            channel_group_id: number
            channel_group: ChannelGroupObjectT | null
            indices: [number, number]
        }[]
        channels: {
            channel_id: number
            channel: ChannelObjectT | null
            indices: [number, number]
        }[]
        messages: {
            message_id: number
            message: MessageObjectT | null
            indices: [number, number]
        }[]
        style: MessageEntityStyleNode[]
    }
}

export type FileObjectT = {
    id: number
    userId: number
    group: string
    path: string
    type: string
    bytes: number
    original: boolean
    refCount: number
    createdAt: Date
    width: number | null
    height: number | null
    tag: string | null
}
