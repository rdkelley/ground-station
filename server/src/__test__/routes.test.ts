import assert from 'node:assert/strict'
import type { AddressInfo } from 'node:net'
import { after, test } from 'node:test'
import type { Telemetry } from '../types.js'
import app from '../app.js'

const server = app.listen(0)
const { port } = server.address() as AddressInfo
const url = `http://localhost:${port}`

after(() => server.close())

test('GET /telemetry returns satellites', async () => {
    const res = await fetch(`${url}/telemetry`)
    const body = (await res.json()) as Telemetry[]

    assert.equal(res.status, 200)
    assert.equal(body.length, 75)
    assert.equal(body[5].velocity, 3.07)
})
test('GET /telemetry/{sat-id} returns a satellite', async () => {
    const res = await fetch(`${url}/telemetry/SAT-15`)
    const body = (await res.json()) as Telemetry

    assert.equal(res.status, 200)
    assert.equal(body.velocity, 4.19)
})
test('POST /telemetry adds a new satellite', async () => {
    const res = await fetch(`${url}/telemetry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            satelliteId: 'TEST-1',
            timestamp: '2026-11-21T12:00:00Z',
            altitude: 550,
            velocity: 7.6,
            status: 'healthy',
        }),
    })
    assert.equal(res.status, 201)
})
test('POST /telemetry returns 422 if altitude is negative', async () => {
    const res = await fetch(`${url}/telemetry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            satelliteId: 'TEST-2',
            timestamp: '2026-11-21T12:00:00Z',
            altitude: -1000,
            velocity: 7.6,
            status: 'healthy',
        }),
    })
    assert.equal(res.status, 422)
})
test('POST /telemetry returns 422 if velocity is negative', async () => {
    const res = await fetch(`${url}/telemetry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            satelliteId: 'TEST-2',
            timestamp: '2026-11-21T12:00:00Z',
            altitude: 550,
            velocity: -7.6,
            status: 'healthy',
        }),
    })
    assert.equal(res.status, 422)
})
test('POST /telemetry returns 422 if timestamp is not valid ISO 8601', async () => {
    const res = await fetch(`${url}/telemetry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            satelliteId: 'TEST-2',
            timestamp: '2026-11-21T50:12:00:00Z',
            altitude: 550,
            velocity: 7.6,
            status: 'healthy',
        }),
    })
    assert.equal(res.status, 422)
})
test('POST /telemetry returns 400 if a field is missing', async () => {
    const res = await fetch(`${url}/telemetry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            satelliteId: 'TEST-2',
            altitude: 550,
            velocity: 7.6,
            status: 'healthy',
        }),
    })
    assert.equal(res.status, 400)
})
