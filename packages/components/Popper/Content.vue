<script setup lang="ts">
import {
  inject,
  computed,
  type CSSProperties,
  unref,
  watch,
  provide,
} from "vue";
import { usePopper } from "@hyl-fake-element-plus/hooks";
import { POPPER_CTX_KEY } from "./Popper";
import {
  POPPER_CONTENT_CTX_KEY,
  type PopperContentEmits,
  type PopperContentInstance,
  type PopperContentProps,
} from "./Content";

defineOptions({
  name: "HPopperContent",
});

const props = defineProps<PopperContentProps>();
const emits = defineEmits<PopperContentEmits>();

const { popperJsInstance, triggerRef, contentRef } = inject(
  POPPER_CTX_KEY,
  undefined
)!;

const opts = computed(() => {
  return {
    placement: props.placement,
    ...props.popperOptions,
  };
});

const { styles, attributes, popperInstanceRef } = usePopper(
  triggerRef,
  contentRef,
  opts
);
const contentStyle = computed(() => {
  return [styles.value["popper"] as CSSProperties];
});
const contentAttrs = computed(() => {
  return unref(attributes).popper;
});
const arrowStyle = computed(() => {
  return [styles.value["arrow"] as CSSProperties];
});
const arrowAttrs = computed(() => {
  return unref(attributes).arrow;
});

watch(popperInstanceRef, (instance) => {
  if (instance) {
    popperJsInstance.value = instance;
  }
});

defineExpose<PopperContentInstance>({
  popperInstanceRef,
});

provide(POPPER_CONTENT_CTX_KEY, {
  popperInstanceRef,
  arrowStyle,
  arrowAttrs,
});
</script>

<template>
  <div
    ref="contentRef"
    :style="contentStyle"
    v-bind="contentAttrs"
    @mouseenter="(e) => emits('mouseenter', e)"
    @mouseleave="(e) => emits('mouseleave', e)"
  >
    <slot></slot>
  </div>
</template>

<style></style>
