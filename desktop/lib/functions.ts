export function is_boolean(value: any) {
    return typeof value === "boolean"
}
export function is_string(value: any) {
    return typeof value === "string"
}
export function is_array(value: any) {
    return Array.isArray(value)
}
export function is_string_or_null(value: any) {
    if (value == null) {
        return true
    }
    return typeof value === "string"
}
export function is_array_or_null(value: any) {
    if (value == null) {
        return true
    }
    return Array.isArray(value)
}
