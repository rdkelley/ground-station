<template>
    <form class="sat-form" @submit.prevent="submit">
        <h2>Create Satellite</h2>

        <label>
            Satellite ID
            <input v-model.trim="form.satelliteId" type="text" required @blur="idValid" />
            <span v-if="idExists" class="error">A satellite with this ID already exists</span>
        </label>

        <label>
            Timestamp
            <input v-model="form.timestamp" type="datetime-local" required />
        </label>

        <label>
            Altitude (km)
            <input v-model.number="form.altitude" type="number" min="0" step="any" required />
            <span v-if="altitudeInvalid" class="error">Altitude can't be negative</span>
        </label>

        <label>
            Velocity (km/s)
            <input v-model.number="form.velocity" type="number" min="0" step="any" required />
            <span v-if="velocityInvalid" class="error">Velocity can't be negative</span>
        </label>

        <label class="status">
            Status
            <select v-model="form.status">
                <option value="healthy">Healthy</option>
                <option value="warning">Warning</option>
                <option value="critical">Critical</option>
            </select>
        </label>

        <p v-if="error" class="error">{{ error }}</p>

        <div class="actions">
            <button type="button" @click="emit('close')">Cancel</button>
            <button
                type="submit"
                :disabled="saving || idExists || altitudeInvalid || velocityInvalid"
            >
                Save
            </button>
        </div>
    </form>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useTelemetryStore } from '@/stores/telemetry'
import type { Status } from '@/types'

const emit = defineEmits<{
    close: []
}>()

const telemetry = useTelemetryStore()

const form = reactive({
    satelliteId: '',
    timestamp: '',
    altitude: null as number | null,
    velocity: null as number | null,
    status: 'healthy' as Status,
})

const saving = ref(false)
const error = ref('')

// Form validation: altitude, velocity checked for positive.
// satId is checked against db to see if already exists
const altitudeInvalid = computed(() => typeof form.altitude === 'number' && form.altitude < 0)
const velocityInvalid = computed(() => typeof form.velocity === 'number' && form.velocity < 0)
const idExists = ref(false)
async function idValid() {
    const id = form.satelliteId.toUpperCase()
    if (!id) return

    const sat = await telemetry.get(id)
    if (id === form.satelliteId.toUpperCase()) idExists.value = sat !== null
}

watch(
    () => form.satelliteId,
    () => {
        idExists.value = false
    },
)

async function submit() {
    saving.value = true
    error.value = await telemetry.create({
        satelliteId: form.satelliteId.toUpperCase(),
        timestamp: new Date(form.timestamp).toISOString(),
        altitude: Number(form.altitude),
        velocity: Number(form.velocity),
        status: form.status,
    })
    saving.value = false

    if (!error.value) emit('close')
}
</script>

<style scoped lang="sass">
.sat-form
    display: flex
    flex-direction: column
    gap: 1rem
    padding: 1rem
    label
        display: flex
        flex-direction: column
        gap: 0.25rem
    .error
        color: white
    .actions
        display: flex
        justify-content: flex-end
        gap: 0.5rem
    .status select
        height: 1.8rem
</style>
