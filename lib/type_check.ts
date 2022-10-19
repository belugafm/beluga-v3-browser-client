export function isBoolean(value: any) {
    return typeof value === "boolean"
}
export function isString(value: any) {
    return typeof value === "string"
}
export function isArray(value: any) {
    return Array.isArray(value)
}
export function isStringOrNull(value: any) {
    if (value == null) {
        return true
    }
    return typeof value === "string"
}
export function isArrayOrNull(value: any) {
    if (value == null) {
        return true
    }
    return Array.isArray(value)
}
