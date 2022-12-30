export const TrustRank = {
    RiskyUser: "RiskyUser",
    Visitor: "Visitor",
    AuthorizedUser: "AuthorizedUser",
    Moderator: "Moderator",
}

export const TrustLevel = {
    [TrustRank.RiskyUser]: 0,
    [TrustRank.Visitor]: 10,
    [TrustRank.AuthorizedUser]: 20,
    [TrustRank.Moderator]: 30,
} as const
