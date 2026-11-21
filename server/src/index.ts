import express, { Request, Response } from 'express'

const app = express()
const port = 3000

app.use(express.json())

app.get('/telemetry', (req: Request, res: Response) => {
    res.json({ message: 'GET /telemetry works' })
})

app.post('/telemetry', (req: Request, res: Response) => {
    res.status(201).json({ message: 'POST /telemetry works too' })
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
