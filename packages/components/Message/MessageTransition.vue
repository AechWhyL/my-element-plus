<script setup lang="ts">
import { TransitionGroup } from 'vue';
</script>

<template>
    <TransitionGroup name="h-message-transition" appear>
        <slot />
    </TransitionGroup>
</template>

<style lang="scss">
.h-message-transition {
    &-move,
    &-enter-active,
    &-leave-active {
        transition: all 0.3s ease;
    }

    &-leave-active {
        position: absolute;
    }

    &-enter-from,
    &-leave-to {
        opacity: 0;
        transform: translateY(-100%);
    }

    &-enter-to,
    &-leave-from {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>