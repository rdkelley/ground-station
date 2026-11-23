import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Telemetry, TelemetryParams } from '@/types'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

/**
 * This store holds global state for telemetry data. It contains both API
 * implementation and the logic for creating query strings and remembering previous
 * strings to facilitate pagination, sorting and filtering. API implementation
 * itself could be factored out to another class if it were to grow larger.
 *
 * Filtering, sorting and pagination itself are done by the server, so this store
 * holds only the current page of results plus the total count. Loading and error refs
 * are also here.
 */
export const useTelemetryStore = defineStore('telemetry', () => {
    const data = ref<Telemetry[]>([])
    const loading = ref(false)
    const error = ref('')

    const total = ref(0)
    const limit = ref(0)
    const params = ref<TelemetryParams>({})

    // Builds a querystring based on previous params and 
    // submits to GET /telemetry
    async function getAll(updates: TelemetryParams = {}) {
        params.value = { ...params.value, ...updates }
        const { page = 1, satId, sort, order, status } = params.value

        loading.value = true
        error.value = ''
        const query = new URLSearchParams({ page: String(page) })

        if (satId) query.set('satId', satId)
        if (sort) query.set('sort', sort)
        if (order) query.set('order', order)
        if (status) query.set('status', status)

        try {
            const res = await fetch(`${API_URL}/telemetry?${query}`)
            if (!res.ok) throw new Error()

            const body = await res.json()
            data.value = body.data
            total.value = body.total
            limit.value = body.limit
        } catch {
            error.value = 'Could not load telemetry data. Is the server offline?'
        } finally {
            loading.value = false
        }
    }

    // Returns sat if it exists, null otherwise
    async function get(satId: string): Promise<Telemetry | null> {
        try {
            const res = await fetch(`${API_URL}/telemetry/${encodeURIComponent(satId)}`)
            if (!res.ok) return null

            return (await res.json()) as Telemetry
        } catch {
            return null
        }
    }

    async function create(entry: Telemetry) {
        try {
            const res = await fetch(`${API_URL}/telemetry`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(entry),
            })

            if (!res.ok) {
                const body = await res.json()
                return body.message as string
            }

            await getAll()
            return ''
        } catch {
            return 'Could not add a new satellite. Is the server offline?'
        }
    }

    async function remove(satId: string) {
        error.value = ''

        try {
            const res = await fetch(`${API_URL}/telemetry/${encodeURIComponent(satId)}`, {
                method: 'DELETE',
            })
            if (!res.ok) throw new Error()

            await getAll()
        } catch {
            error.value = 'Could not delete satellite'
        }
    }

    return { data, total, limit, params, loading, error, getAll, get, create, remove }
})
