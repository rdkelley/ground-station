export interface Telemetry {
    satelliteId: string
    timestamp: string
    altitude: number
    velocity: number
    status: string
    position?: [number, number, number]
}

export interface TelemetryQuery {
    satelliteId?: string
    status?: string
    sort?: string
    order?: string
    limit: number
    offset: number
}

export interface TelemetryResponse {
    data: Telemetry[]
    total: number
    page: number
    limit: number
}
