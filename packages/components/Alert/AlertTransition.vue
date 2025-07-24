<script setup lang="ts">
import { Transition } from 'vue';
</script>

<template>
    <Transition
    name="h-alert-fade"
    >
        <slot></slot>
    </Transition>
</template>

<style>
.h-alert-fade-enter-from,
.h-alert-fade-leave-to{
    opacity: 0;
    transform: translateY(-100%);
}
.h-alert-fade-enter-to,
.h-alert-fade-leave-from{
    opacity: 1;
    transform: translateY(0);
}
.h-alert-fade-enter-active,
.h-alert-fade-leave-active {
  transition: all 0.3s ease-in-out;
}
</style>