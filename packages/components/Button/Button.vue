<script setup lang="ts">
import { throttle } from "lodash-es";
import type { ButtonEmits, ButtonProps } from "./types";
import ErIcon from "../Icon/Icon.vue";
import { computed, ref, useSlots } from "vue";
import type { CSSProperties } from "vue";

defineOptions({
  name: "ErButton",
});
const props = withDefaults(defineProps<ButtonProps>(), {
  tag: "button",
  nativeType: "button",
  type: "primary",
  useThrottle: false,
  throttleDuration: 500,
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
  if ((props.icon) || (props.loading) && !!slots.default) {
    return {
      ['margin-right']: "8px",
    };
  } else {
    return {};
  }
});
</script>
<template>
  <component
    class="er-button"
    :ref="_ref"
    :type="props.nativeType"
    :autofocus="props.autoFocus"
    :disabled="props.disabled || props.loading"
    :class="{
      [`er-button--${props.size}`]: props.size,
      [`er-button--${props.type}`]: props.type,
      'is-plain': props.plain,
      'is-round': props.round,
      'is-circle': props.circle,
      'is-loading': props.loading,
      'is-disabled': props.disabled,
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
