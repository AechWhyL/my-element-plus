<script setup lang="ts">
import { computed, onMounted } from "vue";
import { modalEmits, modalProps } from "./types";
import { ErIcon } from "../Icon";
import { useKeyEvents } from "@hyl-fake-element-plus/hooks";

defineOptions({
  name: "HModal",
});

const props = defineProps(modalProps);
const emits = defineEmits(modalEmits);

// 计算visible状态，确保响应式
const visible = computed(() => props.visible);

function handleClose() {
  emits("close");
}

function handleOverlayClick() {
  if (props.closeOnClickModal) {
    handleClose();
  }
}

const { bindGlobalEvents } = useKeyEvents({
  keys: props.closeOnPressEscape ? ['Escape'] : [],
  global: true,
  onKeyDown: props.closeOnPressEscape ? { 'Escape': handleClose } : {}
});

onMounted(() => {
  if (props.closeOnPressEscape) {
    bindGlobalEvents();
  }
});
</script>

<template>
  <div v-if="visible" class="h-modal">
    <div class="h-modal__overlay" @click="handleOverlayClick"></div>
    <div class="h-modal__container">
      <header class="h-modal__header">
        <slot name="header">{{ title }}</slot>
        <button
          v-if="showClose"
          class="h-modal__close-btn"
          @click="handleClose"
        >
          <er-icon icon="close" />
        </button>
      </header>
      <div class="h-modal__body">
        <slot></slot>
      </div>
      <footer class="h-modal__footer">
        <slot name="footer"></slot>
      </footer>
    </div>
  </div>
</template>

<style scoped>
@import url("./style.scss");
</style>
