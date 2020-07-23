export type UserObjectT = {
    id: string
    name: string
    display_name: string | null
    profile: {
        avatar_image_url: string
        location: string | null
        description: string | null
        theme_color: string | null
        background_image_url: string | null
    }
    stats: {
        statuses_count: number
    }
    created_at: Date
    active: boolean
    dormant: boolean
    muted: boolean
    blocked: boolean
    last_activity_date: Date | null
}

export type CommunityObjectT = {
    id: string
    name: string
    description: string | null
    stats: {
        statuses_count: number
        channels_count: number
    }
    created_at: Date
    creator_id: string
    creator: UserObjectT | null
}

export type ChannelObjectT = {
    id: string
    name: string
    description: string | null
    stats: {
        statuses_count: number
    }
    created_at: Date
    creator_id: string
    creator: UserObjectT | null
    public: boolean
    community_id: string | null
    community: CommunityObjectT | null
}

export type StatusObjectT = {
    id: string
    user_id: string
    user: UserObjectT | null
    channel_id: string
    channel: ChannelObjectT | null
    community_id: string | null
    community: CommunityObjectT | null
    text: string
    created_at: Date
    public: boolean
    edited: boolean
    deleted: boolean
    likes: {
        count: number
        users: UserObjectT[]
        user_ids: string[]
    }
    favorites: {
        count: number
        users: UserObjectT[]
        user_ids: string[]
    }
}
