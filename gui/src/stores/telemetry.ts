import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Telemetry, TelemetryParams } from '@/types'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export const useTelemetryStore = defineStore('telemetry', () => {
    const data = ref<Telemetry[]>([])
    const loading = ref(false)
    const error = ref('')

    const total = ref(0)
    const limit = ref(0)
    const params = ref<TelemetryParams>({})

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
            error.value = 'Could not load telemetry data'
        } finally {
            loading.value = false
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

    return { data, total, limit, params, loading, error, getAll, remove }
})
