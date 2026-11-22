import express, { Request, Response } from 'express'
import satellites from './api/satellite.js'
import { isIsoDateTime } from './util.js'

const app = express()

app.use(express.json())

/**
 * This file contains the server's endpoints, responses and input validation.
 * 
 * Our entry point into the app is index.ts. This file serves as the primary
 * controller for our endpoint logic. From here, `api/satellite.js` methods are called, which 
 * in turn read and write to the in-memory database.
 */

app.get('/telemetry', (req: Request, res: Response) => {
    try {
        const sats = satellites.getAll()
        res.json(sats)
    } catch {
        res.status(500).json({ message: "Couldn't get satellites" })
    }
})
app.get(
    '/telemetry/:satid',
    (req: Request<{ satid: string }>, res: Response) => {
        const satid = req.params.satid
        const sat = satellites.get(satid)
        if (!sat) {
            return res.status(404).json({ message: 'Not found' })
        }
        res.json(sat)
    },
)
app.post('/telemetry', (req: Request, res: Response) => {
    if (!req.body)
        return res.status(400).json({ message: 'Satellite data missing' })

    // Test for missing fields
    const required = [
        'satelliteId',
        'timestamp',
        'altitude',
        'velocity',
        'status',
    ]
    const fields = Object.keys(req.body)
    for (const r of required) {
        if (!fields.includes(r)) {
            return res.status(400).json({ message: `${r} is missing` })
        }
    }
    // Altitude must be positive
    if (req.body.altitude < 0) {
        return res.status(422).json({ message: 'Altitude is negative' })
    }
    // Velocity must be positive
    if (req.body.velocity < 0) {
        return res.status(422).json({ message: 'Velocity is negative' })
    }
    // Timestamp must be valid ISO 8601
    if (!isIsoDateTime(req.body.timestamp)) {
        return res.status(422).json({
            message: 'Timestamp is not a valid ISO 8601 datetime',
        })
    }

    try {
        satellites.create(req.body)
        res.status(201).json({ message: 'Telemetry saved' })
    } catch {
        res.status(400).json({ message: 'Could not add satellite' })
    }
})
app.delete(
    '/telemetry/:satid',
    (req: Request<{ satid: string }>, res: Response) => {
        const deleted = satellites.delete(req.params.satid)
        if (deleted === 0) {
            return res.status(404).json({ message: 'Satellite not found' })
        }
        res.status(200).end()
    },
)

export default app
