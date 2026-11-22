import express, { Request, Response } from 'express'
import satellites from './api/satellite.js'

const app = express()
const port = 3000

app.use(express.json())

app.get('/telemetry', (req: Request, res: Response) => {
    try {
        const sats = satellites.getAll()
        res.json(sats)
    } catch {
        res.status(500).json({ message: 'Couldn\'t get satellites' })
    }
})

app.post('/telemetry', (req: Request, res: Response) => {
    try {
        satellites.create(req.body)
        res.status(201).json({ message: 'Telemetry saved' })
    } catch {
        res.status(400).json({ message: 'Could not add satellite' })
    }
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
