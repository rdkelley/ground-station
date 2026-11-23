<template>
    <form @submit.prevent="filter">
        <input v-model="satId" type="search" placeholder="Search ID" />
        <select v-model="status" name="status" @change="filter">
            <option value="">All statuses</option>
            <option value="healthy">Healthy</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
        </select>
        <button type="button" @click="clear">Clear</button>
        <Loader v-if="telemetry.loading" class="load" :size="20" />
    </form>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useTelemetryStore } from '@/stores/telemetry'
import { Loader } from '@lucide/vue'
import type { Status } from '@/types'

const telemetry = useTelemetryStore()

const satId = ref('')
const status = ref<Status | ''>('')

let timer: ReturnType<typeof setTimeout>

function filter() {
    telemetry.getAll({
        page: 1,
        satId: satId.value,
        status: status.value || undefined,
    })
}

async function clear() {
    satId.value = ''
    status.value = ''

    await nextTick()
    clearTimeout(timer)
    filter()
}

watch(satId, () => {
    clearTimeout(timer)
    timer = setTimeout(filter, 300)
})
</script>

<style lang="sass">
form
    display: flex
    gap: 0.5em
    .load
        position: relative
        top: 5px
        animation: spin 2s linear infinite
</style>
