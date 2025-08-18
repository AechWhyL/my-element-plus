<script setup lang="ts">
import { provide, ref, toRef } from "vue";
import type {
  MessageWrapperProps,
} from "./type";
import { MESSAGE_WRAPPER_CTX_KEY } from "./constants";
import Message from "./Message.vue";

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
  <Message
    v-for="item in messageInstances"
    :key="item.id"
    v-bind="item.config"
  />
</template>
