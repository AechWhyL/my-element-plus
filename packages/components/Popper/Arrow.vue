<script setup lang="ts">
import { inject, computed, useAttrs } from "vue";
import { POPPER_CONTENT_CTX_KEY } from "./Content";

const { arrowStyle, arrowAttrs } = inject(POPPER_CONTENT_CTX_KEY, undefined)!;
const attrs = useAttrs()
const combinedAttrs = computed<Record<string, any>>(() => {
  return {
    ...arrowAttrs.value,
    ...attrs
  }
})
</script>

<template>
    <span 
    :style="arrowStyle"
    v-bind="combinedAttrs"
    data-popper-arrow
    />
</template>

<style></style>