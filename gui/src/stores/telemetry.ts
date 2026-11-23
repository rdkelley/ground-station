import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Telemetry } from '@/types'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export const useTelemetryStore = defineStore('telemetry', () => {
    const data = ref<Telemetry[]>([])
    const loading = ref(false)
    const error = ref('')

    const total = ref(0)

    async function getAll({
        page,
        satId,
        sort,
        order,
        status,
    }: {
        page?: number
        satId?: string
        sort?: string
        order?: 'asc' | 'desc'
        status?: 'healthy' | 'warning' | 'critical'
    } = {}) {
        loading.value = true
        error.value = ''
        const params = new URLSearchParams({ page: String(page ?? 1) })

        if (satId) params.set('satId', satId)
        if (sort) params.set('sort', sort)
        if (order) params.set('order', order)
        if (status) params.set('status', status)

        try {
            const res = await fetch(`${API_URL}/telemetry?${params}`)
            if (!res.ok) throw new Error()

            const body = await res.json()
            data.value = body.data
            total.value = body.total
        } catch {
            error.value = 'Could not load telemetry data'
        } finally {
            loading.value = false
        }
    }

    return { data, total, loading, error, getAll }
})
