<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref } from "vue";
import { ErIcon } from "../Icon";
import { MESSAGE_WRAPPER_CTX_KEY } from "./constants";
import type { MessageConfig } from "./type";

defineOptions({
  name: "HMessage",
});

const ctx = inject(MESSAGE_WRAPPER_CTX_KEY, undefined)!;
const messageRef = ref<HTMLElement>();

const props = withDefaults(defineProps<MessageConfig>(), {
  type: "info",
  duration: 3000,
  effect: "light",
  icon: "",
  customClass: "",
});

const styleTop = computed(() => {
  const lastMessageDom =
    ctx.messageRefs.value[ctx.messageRefs.value.length - 1];
  const lastMessageBottom = lastMessageDom?.getBoundingClientRect().bottom || 0;
  return lastMessageBottom + ctx.gap.value;
});

const defaultIconMap = {
  success: "check-circle",
  info: "info-circle",
  warning: "warning-circle",
  error: "error-circle",
};

onMounted(() => {
  messageRef.value && ctx.messageRefs.value.push(messageRef.value);
});
onBeforeUnmount(() => {
  ctx.messageRefs.value = ctx.messageRefs.value.filter(
    (item) => item !== messageRef.value
  );
});
</script>

<template>
  <div
    class="h-message"
    ref="messageRef"
    :class="{
      [`h-message--${props.type}`]: props.type,
      [`h-message--${props.effect}`]: props.effect,
      [props.customClass]: props.customClass,
    }"
    :style="{ top: styleTop }"
  >
    <div class="h-message__icon">
      <slot name="icon">
        <ErIcon :icon="props.icon || defaultIconMap[props.type]" />
      </slot>
    </div>
    <div class="h-message__content">
      <slot name="content">
        {{ props.message }}
      </slot>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
