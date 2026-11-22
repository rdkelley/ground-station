<template>
    <p>Telemetry App!</p>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

onMounted(async () => {
    const res = await fetch(`${API_URL}/telemetry`)
    console.log(await res.json())
})
</script>
