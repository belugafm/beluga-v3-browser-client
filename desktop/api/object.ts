export type UserObjectT = {
    id: number
    name: string
    twitter_user_id: string | null
    display_name: string | null
    profile_image_url: string | null
    location: string | null
    url: string | null
    description: string | null
    message_count: number
    favorites_count: number
    favorited_count: number
    created_at: Date
    bot: boolean
    active: boolean
    dormant: boolean
    suspended: boolean
    muted: boolean
    blocked: boolean
    trust_level: number
    last_activity_date: Date
}

export type ChannelGroupObjectT = {
    id: number
    name: string
    unique_name: string
    created_at: Date
    created_by: number
    level: number
    channels_count: number
    statuses_count: number
    creator: UserObjectT | null
}

export type ChannelObjectT = {
    id: number
    name: string
    unique_name: string
    status_string: string
    description: string
    created_at: number
    created_by: number
    message_count: number
    parent_channel_group_id: number
    creator: UserObjectT | null
    parent_channel_group: ChannelGroupObjectT | null
}

export type MessageObjectT = {
    id: number
    user_id: number
    user: UserObjectT | null
    channel_id: number
    channel: ChannelObjectT | null
    text: string
    created_at: Date
    updated_at: number
    public: boolean
    edited: boolean
    deleted: boolean
    favorited: boolean
    reply_count: number
    like_count: number
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
    }
    favorite: {
        count: number
        users: UserObjectT[]
        user_ids: number[]
    }
}
