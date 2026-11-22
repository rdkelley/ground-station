import assert from 'node:assert/strict'
import type { AddressInfo } from 'node:net'
import { after, test } from 'node:test'
import type { Telemetry, TelemetryResponse } from '../types.js'
import app from '../app.js'

const server = app.listen(0)
const { port } = server.address() as AddressInfo
const url = `http://localhost:${port}`

after(() => server.close())

test('GET /telemetry returns a page of satellites', async () => {
    const res = await fetch(`${url}/telemetry`)
    const body = (await res.json()) as TelemetryResponse

    assert.equal(res.status, 200)
    assert.equal(body.page, 1)
    assert.equal(body.data.length, 25)
})
test('GET /telemetry uses filters, sorting and pagination', async () => {
    await fetch(`${url}/telemetry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            satelliteId: 'SAT-59-TEST',
            timestamp: '2026-11-21T12:00:00Z',
            altitude: 550,
            velocity: 7.6,
            status: 'critical',
        }),
    })

    const res = await fetch(
        `${url}/telemetry?sort=altitude&order=asc&page=1&status=critical&satId=SAT-59`,
    )
    const body = (await res.json()) as TelemetryResponse

    assert.equal(res.status, 200)
    assert.equal(body.page, 1)
})
test('GET /telemetry/{sat-id} returns a satellite', async () => {
    const res = await fetch(`${url}/telemetry/SAT-15`)
    const body = (await res.json()) as Telemetry

    assert.equal(res.status, 200)
    assert.equal(body.velocity, 3.07)
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
test('DELETE /telemetry/{satid} deletes a satellite', async () => {
    await fetch(`${url}/telemetry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            satelliteId: 'TEST-DEL',
            timestamp: '2026-11-21T12:00:00Z',
            altitude: 550,
            velocity: 7.6,
            status: 'healthy',
        }),
    })
    const res = await fetch(`${url}/telemetry/TEST-DEL`, { method: 'DELETE' })
    assert.equal(res.status, 200)

    const getDel = await fetch(`${url}/telemetry/DELETE-ME`)
    assert.equal(getDel.status, 404)
})
