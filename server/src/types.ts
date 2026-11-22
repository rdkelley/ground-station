export interface Telemetry {
    satelliteId: string
    timestamp: string
    altitude: number
    velocity: number
    status: string
    position?: [number, number, number]
}