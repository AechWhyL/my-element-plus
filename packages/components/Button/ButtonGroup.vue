<script setup lang="ts">
import { provide, reactive, toRef } from "vue";
import {type ButtonGroupProps } from "./types";
import { BUTTON_GROUP_CONTEXT_KEY } from "./constant";

defineOptions({
  name: "ErButtonGroup",
});

const props = withDefaults(defineProps<ButtonGroupProps>(), {
  type: "primary",
  size: "default",
  disabled: false,
});

provide(BUTTON_GROUP_CONTEXT_KEY,
    reactive({
        size:toRef(props.size),
        type:toRef(props.type),
        disabled:toRef(props.disabled),
    })
)
</script>

<template>
  <div class="er-button-group">
    <slot></slot>
  </div>
</template>

<style scoped>
@import url("./style.css");
</style>