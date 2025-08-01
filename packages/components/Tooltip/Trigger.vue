<script setup lang="ts">
import type { TooltipTriggerProps } from "./Trigger";
import HPopperTrigger from "../Popper/Trigger.vue";
import { useTrigger } from "./composables/useTrigger";

const props = withDefaults(defineProps<TooltipTriggerProps>(), {
  trigger: "hover",
});

const { onClick, onMouseEnter, onMouseLeave, onFocus, onBlur, virtualRef, virtualTrigger } = useTrigger(props);

</script>

<template>
  <HPopperTrigger
    ref="popperTriggerRef"
    class="h-tooltip-trigger"
    :virtual-ref="virtualRef"
    :virtual-trigger="virtualTrigger"
    @click="onClick"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @focus="onFocus"
    @blur="onBlur"
  >
    <slot></slot>
  </HPopperTrigger>
</template>

<style></style>
