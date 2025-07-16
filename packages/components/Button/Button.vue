<script setup lang="ts">
import { throttle } from "lodash-es";
import type { ButtonEmits, ButtonProps } from "./types";
import ErIcon from "../Icon/Icon.vue";
import { computed, ref, inject } from "vue";
import { BUTTON_GROUP_CONTEXT_KEY } from "./constant";

defineOptions({
  name: "ErButton",
});
const props = withDefaults(defineProps<ButtonProps>(), {
  tag: "button",
  nativeType: "button",
  useThrottle: false,
  throttleDuration: 500,
});

const ctx = inject(BUTTON_GROUP_CONTEXT_KEY, void 0);

const computedSize = computed(() => {
  return ctx?.size ?? props.size ?? "default";
});
const computedType = computed(() => {
  return ctx?.type ?? props.type ?? "primary";
});

const computedDisabled = computed(() => {
  return props.disabled || ctx?.disabled || false;
});

const _ref = ref<HTMLButtonElement>();

const slots = defineSlots();

const emits = defineEmits<ButtonEmits>();
const handleBtnClick = (e: MouseEvent) => emits("click", e);

const handleBtnClickThrottled = throttle(
  handleBtnClick,
  props.throttleDuration
);

const iconStyle = computed(() => {
  if (!!slots.default) {
    return {
      ["margin-right"]: "8px",
    };
  } else {
    return {};
  }
});

defineExpose({
  _ref: _ref,
});
</script>
<template>
  <component
    class="er-button"
    :ref="_ref"
    :type="props.nativeType"
    :autofocus="props.autoFocus"
    :disabled="computedDisabled || props.loading"
    :class="{
      [`er-button--${computedSize}`]: computedSize,
      [`er-button--${computedType}`]: computedType,
      'is-plain': props.plain,
      'is-round': props.round,
      'is-circle': props.circle,
      'is-loading': props.loading,
      'is-disabled': computedDisabled,
    }"
    :is="props.tag"
    @click="(e:MouseEvent)=>{
        props.useThrottle?handleBtnClickThrottled(e):handleBtnClick(e)
    }"
  >
    <slot name="loading">
      <er-icon
        v-if="loading"
        class="er-loading-icon"
        :icon="loadingIcon ?? 'spinner'"
        spin
        :style="iconStyle"
        size="1x"
      />
    </slot>
    <er-icon
      v-if="icon && !loading"
      :icon="icon"
      size="1x"
      :style="iconStyle"
    />
    <slot></slot>
  </component>
</template>

<style scoped>
@import url("./style.css");
</style>
