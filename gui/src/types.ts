export interface Telemetry {
    satelliteId: string
    timestamp: string
    altitude: number
    velocity: number
    status: string
}

export interface TelemetryPage {
    data: Telemetry[]
    total: number
    page: number
    limit: number
}

export type Status = 'healthy' | 'warning' | 'critical'

export interface TelemetryParams {
    page?: number
    satId?: string
    sort?: string
    order?: 'asc' | 'desc'
    status?: Status
}
