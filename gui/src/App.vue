<template>
    <main>
        <div class="error" v-if="telemetry.error">Error: {{ telemetry.error }}</div>
        <div class="title">
            <h1>Ground Station</h1>
            <Satellite :size="24" />
        </div>
        <toolbar @new="openPanel = true" />
        <teleTable />
        <panel :open="openPanel" @close="openPanel = false" />
        <div class="version">v{{ version }}</div>
    </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import panel from '@/components/panel.vue'
import teleTable from '@/components/table.vue'
import toolbar from '@/components/toolbar.vue'
import { Satellite } from '@lucide/vue'
import { version } from '../package.json'
import { useTelemetryStore } from '@/stores/telemetry'

import '@/reset.sass'

const openPanel = ref(false)

const telemetry = useTelemetryStore()
</script>

<style lang="sass">
body
    background: #000c3b

main
    color: white
    font-family: 'Ubuntu Mono', monospace
    padding: 1rem
    height: 100vh
    button
        border-radius: 5px
        height: 2rem
    .title
        display: flex
        margin-bottom: 1rem
        h1
            color: #ff6214
            font-size: 2em
    .version
        position: absolute
        bottom: 0
        right: 0
        padding: 1rem
    .error
        background: red
        text-align: center
</style>
