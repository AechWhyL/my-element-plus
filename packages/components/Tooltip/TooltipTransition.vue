<script setup lang="ts">
defineProps<{
  transition?: string;
}>();
</script>

<template>
  <Transition :name="transition || 'h-tooltip-fade'">
    <slot></slot>
  </Transition>
</template>

<style>
.h-tooltip-fade-enter-active,
.h-tooltip-fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}
.h-tooltip-fade-enter-from,
.h-tooltip-fade-leave-to {
  opacity: 0;
}
</style>
