<script setup lang="ts">
defineProps<{
    open: boolean
}>()

const emit = defineEmits<{
    close: []
}>()
</script>

<template>
    <Transition name="fade">
        <div v-if="open" class="backdrop" @click="emit('close')"></div>
    </Transition>

    <Transition name="slide">
        <aside v-if="open" class="panel"></aside>
    </Transition>
</template>

<style lang="sass">
.backdrop
    position: fixed
    inset: 0
    z-index: 10
    background: rgba(0, 0, 0, 0.3)

.panel
    position: fixed
    top: 0
    bottom: 0
    right: 0
    z-index: 11
    width: 40rem
    max-width: 100%
    background: white

.slide-enter-active, .slide-leave-active
    transition: transform 0.25s ease

.slide-enter-from, .slide-leave-to
    transform: translateX(100%)

.fade-enter-active, .fade-leave-active
    transition: opacity 0.25s ease

.fade-enter-from, .fade-leave-to
    opacity: 0
</style>
