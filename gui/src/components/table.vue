<template>
    <div>
        <div class="pagination">
            <button type="button" :disabled="page <= 1" @click="toPage(page - 1)">Prev</button>
            <span>Page {{ page }} of {{ pageCount }}</span>
            <button type="button" :disabled="page >= pageCount" @click="toPage(page + 1)">
                Next
            </button>
        </div>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th
                            v-for="col in columns"
                            :key="col.key"
                            :class="`${col.label.toLowerCase().split(' ')[0]}`"
                        >
                            <button type="button" class="sort" @click="sort(col.key)">
                                <div class="col-label">{{ col.label }}</div>
                                <template v-if="telemetry.params.sort === col.key">
                                    <ArrowDown
                                        v-if="telemetry.params.order === 'desc'"
                                        :size="14"
                                    />
                                    <ArrowUp v-else :size="14" />
                                </template>
                            </button>
                        </th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="telemetry.data.length === 0">
                        <td class="message" :colspan="columns.length + 1">No telemetry found</td>
                    </tr>
                    <template v-else>
                        <tr v-for="sat in telemetry.data" :key="sat.satelliteId">
                            <td class="satId">{{ sat.satelliteId }}</td>
                            <td class="timestamp">{{ sat.timestamp }}</td>
                            <td class="altitude">{{ sat.altitude }}</td>
                            <td class="velocity">{{ sat.velocity }}</td>
                            <td class="status">{{ sat.status }}</td>
                            <td>
                                <button
                                    type="button"
                                    class="delete"
                                    :title="`Delete ${sat.satelliteId}`"
                                    @click="onDelete(sat.satelliteId)"
                                >
                                    <Trash2 :size="16" />
                                </button>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useTelemetryStore } from '@/stores/telemetry'
import { ArrowDown, ArrowUp, Trash2 } from '@lucide/vue'

const telemetry = useTelemetryStore()

const columns = [
    { key: 'satelliteId', label: 'Satellite ID' },
    { key: 'timestamp', label: 'Timestamp' },
    { key: 'altitude', label: 'Altitude (km)' },
    { key: 'velocity', label: 'Velocity (km/s)' },
    { key: 'status', label: 'Status' },
]

const page = computed(() => telemetry.params.page ?? 1)
const pageCount = computed(() =>
    telemetry.limit ? Math.max(Math.ceil(telemetry.total / telemetry.limit), 1) : 1,
)

function sort(key: string) {
    const { sort, order } = telemetry.params
    const next = sort === key && order === 'asc' ? 'desc' : 'asc'

    telemetry.getAll({ page: 1, sort: key, order: next })
}

function toPage(page: number) {
    telemetry.getAll({ page })
}

async function onDelete(satId: string) {
    if (!confirm(`Delete ${satId}?`)) return
    await telemetry.remove(satId)
    if (telemetry.data.length === 0 && page.value > 1) toPage(page.value - 1)
}

onMounted(async () => {
    await telemetry.getAll()
})
</script>

<style lang="sass">
.pagination
    display: flex
    justify-content: center
    align-items: center
    gap: 1rem
    margin-bottom: 1rem

.table-container
    height: calc(100vh - 15rem)
    overflow-y: scroll
    border: 1px solid #ff6214
    table
        width: 100%
        border-collapse: separate
        border-spacing: 0
    thead th
        position: sticky
        top: 0
        z-index: 1
        background: black
        text-align: left
        &.altitude, &.velocity
            text-align: right
        &.status
            text-align: center
    th, td
        padding: 0.5rem 0.75rem
        text-align: center
        border-bottom: 1px solid white
    td
        text-align: left
        &.altitude, &.velocity
            text-align: right
        &.status
            text-align: center
    .sort
        display: inline-flex
        align-items: center
        gap: 0.25rem
        border: none
        background: none
        color: white
        cursor: pointer
    .delete
        border: none
        background: none
        color: white
        cursor: pointer
        &:hover
            color: red
</style>
