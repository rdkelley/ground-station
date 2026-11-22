import { db } from '../db.js'
import { Telemetry } from '../types.js'

class Satellite {
    get(id: string) {
        return db
            .prepare('SELECT * FROM telemetry WHERE satelliteId = ?')
            .get(id)
    }
    getAll() {
        return db.prepare('SELECT * FROM telemetry').all()
    }
    create(t: Telemetry) {
        db.prepare(
            'INSERT INTO telemetry (satelliteId, timestamp, altitude, velocity, status, positionX, positionY, positionZ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        ).run(
            t.satelliteId,
            t.timestamp,
            t.altitude,
            t.velocity,
            t.status,
            t.position?.[0] ?? null,
            t.position?.[1] ?? null,
            t.position?.[2] ?? null,
        )
    }
    delete(satelliteId: string) {
        return db
            .prepare('DELETE FROM telemetry WHERE satelliteId = ?')
            .run(satelliteId).changes
    }
}

export default new Satellite()
