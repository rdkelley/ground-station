<template>
    <div class="toolbar">
        <filters />
        <button type="button" @click="emit('new')">
            New Satellite <span class="rocket"><Rocket :size="16" /></span>
        </button>
    </div>
</template>

<script setup lang="ts">
import { Rocket } from '@lucide/vue'
import filters from '@/components/filter.vue'

const emit = defineEmits<{
    new: []
}>()
</script>

<style lang="sass">
.toolbar
    display: flex
    justify-content: space-between
    align-items: center
    margin-bottom: 1rem
    @media (max-width: 600px)
        flex-direction: column
        align-items: stretch
        gap: 0.5rem
        padding: 0.5rem
    .rocket
        position: relative
        top: 3px
</style>
