import { db } from '../db.js'
import { Telemetry, TelemetryQuery } from '../types.js'

const SORTABLE_FIELDS = ['satelliteId', 'timestamp', 'altitude', 'velocity', 'status']

/*
 * Satellite class to abstract out SQL syntax from API implementation
 */
class Satellite {
    get(id: string) {
        return db.prepare('SELECT * FROM telemetry WHERE satelliteId = ?').get(id)
    }

    /**
     * getALl builds a SQL string based on requested sort, filter and pagination and
     * calls the DB twice: once for paginated data, another for total count.
     * Returns requested data along with total count 
     */
    getAll(query: TelemetryQuery) {
        const conditions: string[] = []
        const params: string[] = []

        // If searching for sat id: push LIKE operator to conditions for partial matches
        // and add wildcard term to params
        if (query.satelliteId) {
            conditions.push('satelliteId LIKE ?')
            params.push(`%${query.satelliteId}%`)
        }

        // If filtering by status
        if (query.status) {
            conditions.push('status = ?')
            params.push(query.status)
        }

        // Join condition statements
        const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

        // If valid sort term, add term and order
        const sort = query.sort && SORTABLE_FIELDS.includes(query.sort) ? query.sort : 'rowid'
        const order = query.order === 'desc' ? 'DESC' : 'ASC'

        // Assemble full SQL string, first get rows for requested page...
        const data = db
            .prepare(
                `SELECT * FROM telemetry ${where} ORDER BY ${sort} ${order}, rowid LIMIT ? OFFSET ?`,
            )
            .all(...params, query.limit, query.offset)

        // ...then do same query for all records matching query to get total
        const count = db
            .prepare(`SELECT COUNT(*) AS total FROM telemetry ${where}`)
            .get(...params) as { total: number }

        return { data, total: count.total }
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
    delete(satId: string) {
        return db.prepare('DELETE FROM telemetry WHERE satelliteId = ?').run(satId).changes
    }
}

export default new Satellite()
