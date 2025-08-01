<script setup lang="ts">
import type { AlertEmits, AlertProps, AlertSlots, AlertType } from "./types";
import { ErIcon } from "../Icon";
import { onMounted, ref } from "vue";
import AlertTransition from "./AlertTransition.vue";

defineOptions({
  name: "HAlert",
});

const props = withDefaults(defineProps<AlertProps>(), {
  title: "",
  duration: 5000,
  description: "",
  closable: true,
  showIcon: true,
  type: "info",
  effect: "light",
});

const visible = ref(true);

const defaultIcons: Record<AlertType, string> = {
  success: "circle-check",
  info: "circle-info",
  warning: "circle-exclamation",
  error: "circle-xmark",
};

const emits = defineEmits<AlertEmits>();

const slots = defineSlots<AlertSlots>();

const handleClose = () => {
  visible.value = false;
  emits("close");
};
</script>

<template>
  <AlertTransition>
    <div
      v-if="visible"
      class="h-alert"
      :class="{
        [`h-alert--${type}`]: type,
        [`is-center`]: center,
        [`h-alert--${effect}`]: effect,
      }"
    >
      <div class="h-alert__header" v-bind="$attrs">
        <div class="h-alert__title-wrapper">
          <div v-if="showIcon" class="h-alert__icon">
            <slot name="icon">
              <ErIcon
                :icon="defaultIcons[type]"
                class="header-icon default-icon"
              />
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
            <ErIcon icon="x" class="close-icon" />
          </slot>
        </div>
      </div>
      <div
        v-if="slots.description || slots.default || props.description"
        class="h-alert__description-wrapper"
      >
        <div class="h-alert__description">
          <slot name="description" v-if="slots.description">
            {{ props.description }}
          </slot>
          <slot name="default" v-else>
            {{ props.description }}
          </slot>
        </div>
      </div>
    </div>
  </AlertTransition>
</template>

<style scoped>
@import url("./style.css");
</style>
