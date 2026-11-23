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
