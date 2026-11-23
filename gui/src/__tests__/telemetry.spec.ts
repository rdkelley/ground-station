import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useTelemetryStore } from '@/stores/telemetry'

function mockFetch() {
    const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ data: [], total: 0, page: 1, limit: 20 }),
    })
    vi.stubGlobal('fetch', fetchMock)
    return fetchMock
}

function requestedQuery(fetchMock: ReturnType<typeof vi.fn>) {
    const url = fetchMock.mock.calls[0]?.[0] as string
    return Object.fromEntries(new URLSearchParams(url.split('?')[1]))
}

describe('telemetry store', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('it builds the correct query', async () => {
        const fetchMock = mockFetch()
        const store = useTelemetryStore()

        await store.getAll({ page: 2, status: 'critical' })

        const url = fetchMock.mock.calls[0]?.[0] as string
        expect(url).toContain('/telemetry?')
        expect(requestedQuery(fetchMock)).toEqual({
            page: '2',
            status: 'critical',
        })
    })
})
