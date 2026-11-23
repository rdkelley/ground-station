<template>
    <p v-if="telemetry.loading">Loading...</p>
    <p v-else-if="telemetry.error">{{ telemetry.error }}</p>
    <table v-else>
        <thead>
            <tr>
                <th>Satellite ID</th>
                <th>Timestamp</th>
                <th>Altitude</th>
                <th>Velocity</th>
                <th>Health Status</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="sat in telemetry.data" :key="sat.satelliteId">
                <td>{{ sat.satelliteId }}</td>
                <td>{{ sat.timestamp }}</td>
                <td>{{ sat.altitude }}</td>
                <td>{{ sat.velocity }}</td>
                <td>{{ sat.status }}</td>
            </tr>
        </tbody>
    </table>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useTelemetryStore } from '@/stores/telemetry'

const telemetry = useTelemetryStore()

onMounted(async () => {
    await telemetry.getAll()
    console.log(telemetry.data)
})
</script>

<style scoped lang="sass">
table
    --border: #d0d7de
    --muted: #57606a
    --hover: #f6f8fa

    width: 100%
    border-collapse: collapse
    font-family: 'Ubuntu Mono', monospace

th, td
    padding: 0.5rem 0.75rem
    text-align: center
    border-bottom: 1px solid var(--border)

th
    color: var(--muted)
    font-weight: 600

tbody tr:hover
    background: var(--hover)
</style>
