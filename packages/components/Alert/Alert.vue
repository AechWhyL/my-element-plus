<script setup lang="ts">
import type { AlertEmits, AlertProps } from "./types";

defineOptions({
  name: "HAlert",
});

const props = withDefaults(defineProps<AlertProps>(), {
  title: "",
  duration: 5000,
  description: "",
  closable: true,
  showIcon: true,
});

const emits = defineEmits<AlertEmits>();

const handleClose = () => {
  emits("close");
};
</script>

<template>
  <div
    class="h-alert"
    :class="{
      [`h-alert--${type}`]: type,
      [`is-center`]: props.center,
      [`h-alert--${effect}`]: effect,
    }"
  >
    <div class="h-alert__header" v-bind="$attrs">
      <div class="h-alert__title-wrapper">
        <div v-if="showIcon" class="h-alert__icon">
          <slot name="icon">
            <ErIcon icon="circle-info" class="header-icon default-icon" />
          </slot>
        </div>
        <div class="h-alert__title">
          <slot name="title">
            {{ props.title }}
          </slot>
        </div>
      </div>
      <div v-if="closable" class="h-alert__close" @click="handleClose">
        <slot name="close">
          <ErIcon icon="xmark" class="close-icon" />
        </slot>
      </div>
    </div>
    <div class="h-alert__description-wrapper">
      <div class="h-alert__description">
        <slot name="description">
          {{ props.description }}
        </slot>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("./style.css");
</style>
