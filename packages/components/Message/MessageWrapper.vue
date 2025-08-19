<script setup lang="ts">
import { provide, ref, toRef } from "vue";
import type { MessageWrapperProps } from "./type";
import { MESSAGE_WRAPPER_CTX_KEY } from "./constants";
import Message from "./Message.vue";
import MessageTransition from "./MessageTransition.vue";

const props = withDefaults(defineProps<MessageWrapperProps>(), {
  gap: 20,
});

const messageInstances = toRef(props, "messageInstances");
const messageRefs = ref<HTMLElement[]>([]);

provide(MESSAGE_WRAPPER_CTX_KEY, {
  messageInstances,
  gap: toRef(props, "gap"),
  messageRefs,
});
</script>

<template>
  <div class="h-message-wrapper">
    <MessageTransition>
      <Message
        v-for="(item, index) in messageInstances"
        :key="item.id"
        :index="index"
        v-bind="item.config"
        :grouping-count="item.count"
      />
    </MessageTransition>
  </div>
</template>

<style lang="scss">
.h-message-wrapper {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 100%;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  z-index: 2000;
}
</style>
