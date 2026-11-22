import express, { Request, Response } from 'express'
import satellites from './models/satellite.js'
import { isIsoDateTime } from './util.js'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())

const PAGE_SIZE = 25

/**
 * This file contains the server's endpoints, responses and input validation.
 *
 * Our entry point into the app is index.ts. This file serves as the primary
 * controller for our endpoint logic. From here, `api/satellite.js` methods are called, which
 * in turn read and write to the in-memory database.
 */

// GET /telemetry allows for sorting, pagination and filtering by status & satId
app.get('/telemetry', (req: Request, res: Response) => {
    // Default to page size === 1, throw 422 if page size is invalid
    const page = req.query.page === undefined ? 1 : Number(req.query.page)
    if (!Number.isInteger(page) || page < 1) {
        return res.status(422).json({ message: 'Page size must be positive, whole num' })
    }

    // Params can be defined strings or undefined depending on the query
    let satId: string | undefined
    if (typeof req.query.satId === 'string') satId = req.query.satId

    let status: string | undefined
    if (typeof req.query.status === 'string') status = req.query.status

    let sort: string | undefined
    if (typeof req.query.sort === 'string') sort = req.query.sort

    let order: string | undefined
    if (typeof req.query.order === 'string') order = req.query.order

    try {
        const { data, total } = satellites.getAll({
            satelliteId: satId,
            status,
            sort,
            order,
            limit: PAGE_SIZE,
            offset: (page - 1) * PAGE_SIZE,
        })

        res.json({ data, total, page, limit: PAGE_SIZE })
    } catch {
        res.status(500).json({ message: "Couldn't get satellites" })
    }
})
app.get('/telemetry/:satid', (req: Request<{ satid: string }>, res: Response) => {
    const satid = req.params.satid
    const sat = satellites.get(satid)
    if (!sat) {
        return res.status(404).json({ message: 'Not found' })
    }
    res.json(sat)
})
app.post('/telemetry', (req: Request, res: Response) => {
    if (!req.body) return res.status(400).json({ message: 'Satellite data missing' })

    // Test for missing fields
    const required = ['satelliteId', 'timestamp', 'altitude', 'velocity', 'status']
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
app.delete('/telemetry/:satid', (req: Request<{ satid: string }>, res: Response) => {
    const deleted = satellites.delete(req.params.satid)
    if (deleted === 0) {
        return res.status(404).json({ message: 'Satellite not found' })
    }
    res.status(200).end()
})

export default app
