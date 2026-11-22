import { readFileSync } from 'node:fs'
import { DatabaseSync } from 'node:sqlite'

export const db = new DatabaseSync(':memory:')

// Table schema. timestamp has check to ensure
// ISO 8601 datetime. This is also checked in POST
// reqs as part of validation.
db.exec(`
  CREATE TABLE telemetry (
    satelliteId TEXT PRIMARY KEY NOT NULL,
    timestamp TEXT NOT NULL CHECK (
        timestamp GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]T[0-9][0-9]:[0-9][0-9]:[0-9][0-9]*'
        AND datetime(timestamp) IS NOT NULL
    ),
    altitude FLOAT NOT NULL,
    velocity FLOAT NOT NULL,
    status TEXT NOT NULL,
    positionX FLOAT,
    positionY FLOAT,
    positionZ FLOAT
  )
`)

const lines = readFileSync('data/telemetry.csv', 'utf8').trim().split(/\r?\n/)
const insert = db.prepare('INSERT INTO telemetry VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
for (const line of lines.slice(1)) {
    insert.run(...line.split(','))
}

console.log(`Loaded ${lines.length - 1} satellites`)
