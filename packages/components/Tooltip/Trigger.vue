<script setup lang="ts">
import { inject, toRef } from "vue";
import { TOOLTIP_CTX_KEY } from "./contants";
import { triggerWhen } from "./utils";
import type { TooltipTriggerProps } from "./Trigger";
import HPopperTrigger from "../Popper/Trigger.vue";

const props = withDefaults(defineProps<TooltipTriggerProps>(), {
  trigger: "hover",
});

const { onOpen, onHide, onToggle, virtualRef, virtualTrigger } = inject(
  TOOLTIP_CTX_KEY,
  undefined
)!;

const trigger = toRef(props, "trigger");

const onClick = triggerWhen("click", trigger, onToggle);
const onMouseEnter = triggerWhen("hover", trigger, onOpen);
const onMouseLeave = triggerWhen("hover", trigger, onHide);
const onFocus = triggerWhen("focus", trigger, onOpen);
const onBlur = triggerWhen("focus", trigger, onHide);
</script>

<template>
  <HPopperTrigger
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
