const isoPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/

export function isIsoDateTime(value: string) {
    return isoPattern.test(value) && !Number.isNaN(Date.parse(value))
}
