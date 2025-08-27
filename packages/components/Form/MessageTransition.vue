<template>
<Transition name="h-form-message-transition">
    <slot></slot>
</Transition>
</template>

<script setup lang="ts">
</script>

<style>
.h-form-message-transition-enter-active,
.h-form-message-transition-leave-active {
    transition: all 0.3s ease-in-out;
}

.h-form-message-transition-enter-from,
.h-form-message-transition-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}

.h-form-message-transition-enter-to,
.h-form-message-transition-leave-from {
    opacity: 1;
    transform: translateY(0);
}
</style>