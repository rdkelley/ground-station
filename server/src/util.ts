export function isIsoDateTime(value: string) {
    try {
        Temporal.Instant.from(value)
        return true
    } catch {
        return false
    }
}
