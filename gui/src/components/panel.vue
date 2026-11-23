<template>
    <Transition name="slide">
        <aside v-if="open" class="panel">
            <create @close="emit('close')" />
        </aside>
    </Transition>
</template>

<script setup lang="ts">
import create from '@/components/create.vue'

defineProps<{
    open: boolean
}>()

const emit = defineEmits<{
    close: []
}>()
</script>

<style lang="sass">
.panel
    position: fixed
    top: 0
    bottom: 0
    right: 0
    z-index: 20
    width: 30rem
    max-width: 100%
    background: black
    border-left: 1px solid white

.slide-enter-active, .slide-leave-active
    transition: transform 0.25s ease

.slide-enter-from, .slide-leave-to
    transform: translateX(100%)

.fade-enter-active, .fade-leave-active
    transition: opacity 0.25s ease

.fade-enter-from, .fade-leave-to
    opacity: 0
</style>
