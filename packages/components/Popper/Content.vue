<script setup lang="ts">
import { ref, inject, computed, type CSSProperties, unref, watch } from "vue";
import { usePopper } from "@hyl-fake-element-plus/hooks";
import { POPPER_CTX_KEY } from "./Popper";
import type { PopperContentInstance, PopperContentProps } from "./Content";

defineOptions({
  name: "HPopperContent",
});

const props = defineProps<PopperContentProps>();

const { popperJsInstance, triggerRef, contentRef } = inject(
  POPPER_CTX_KEY,
  undefined
)!;

const { styles, attributes, popperInstanceRef } = usePopper(
  triggerRef,
  contentRef
);
const contentStyle = computed(() => {
  return [styles.value["popper"] as CSSProperties];
});
const contentAttrs = computed(() => {
  return unref(attributes).popper;
});

watch(popperInstanceRef, (instance) => {
  if (instance) {
    popperJsInstance.value = instance;
  }
});

defineExpose<PopperContentInstance>({
  popperInstanceRef,
});
</script>

<template>
  <div ref="contentRef" :style="contentStyle" v-bind="contentAttrs"
  
  >
    <slot></slot>
  </div>
</template>

<style></style>
