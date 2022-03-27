export type UserObjectT = {
    id: number
    name: string
    twitter_user_id: string | null
    display_name: string | null
    profile_image_url: string | null
    location: string | null
    url: string | null
    description: string | null
    theme_color: string | null
    background_image_url: string | null
    default_profile: boolean
    statuses_count: number
    favorites_count: number
    favorited_count: number
    likes_count: number
    liked_count: number
    created_at: Date
    bot: boolean
    active: boolean
    dormant: boolean
    suspended: boolean
    trustLevel: number
    last_activity_date: Date
    terms_of_service_agreement_date: Date
    terms_of_service_agreement_version: string
    registration_ip_address: string
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
    created_at: number
    created_by: number
    channels_count: number
    statuses_count: number
    parent_channel_group_id: number
    creator: UserObjectT | null
    parent_channel_group: ChannelGroupObjectT | null
}

export type StatusObjectT = {
    id: number
    user_id: string
    user: UserObjectT | null
    channel_id: string
    channel: ChannelObjectT | null
    text: string
    created_at: number
    updated_at: number
    public: boolean
    edited: boolean
    deleted: boolean
    favorited: boolean
    comment_count: number
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
        statuses: {
            status_id: number
            status: StatusObjectT | null
            indices: [number, number]
        }[]
    }
    likes: {
        count: number
    }
    favorites: {
        count: number
        users: UserObjectT[]
        user_ids: string[]
    }
}
