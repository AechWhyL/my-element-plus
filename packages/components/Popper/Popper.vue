<script setup lang="ts">
import { provide, ref } from "vue";
import type { Instance as PopperInstance } from "@popperjs/core";
import { POPPER_CTX_KEY, type PopperContext } from "./Popper";

defineOptions({
  name: "HPopper",
});

const triggerRef = ref<HTMLElement | null>(null);
const popperJsInstance = ref<PopperInstance>();
const contentRef = ref<HTMLElement>();

const ctx = {
  triggerRef,
  popperJsInstance,
  contentRef,
} as PopperContext;

provide(POPPER_CTX_KEY, ctx);
defineExpose<PopperContext>(ctx);
</script>

<template>
  <slot></slot>
</template>
