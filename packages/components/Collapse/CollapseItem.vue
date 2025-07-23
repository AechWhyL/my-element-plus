<script setup lang="ts">
import { ErIcon } from "../Icon";
import CollapseItemTransition from "./CollapseItemTransition.vue";
import { COLLAPSE_CTX_KEY } from "./constants";
import type { CollapseItemProps } from "./types";
import { computed, inject } from "vue";

defineOptions({
  name: "ErCollapseItem",
});

const ctx = inject(COLLAPSE_CTX_KEY, void 0);
const props = defineProps<CollapseItemProps>();

const isActive = computed(() => {
  return ctx?.activeNames.value.includes(props.name);
});

const handleItemClick = () => {
  if (props.disabled) return;
  ctx?.handleItemClick(props.name);
};
</script>

<template>
  <div
    class="er-collapse-item"
    :class="{
      [`er-collapse-disabled`]: props.disabled,
    }"
  >
    <div
      class="er-collapse-item__header"
      :id="`er-collapse-item__header-${name}`"
      :class="{
        [`er-collapse-item__header--active`]: isActive,
        [`er-collapse-item__header--disabled`]: props.disabled,
      }"
      @click="handleItemClick"
    >
      <div class="er-collapse-item__title">
        <slot name="title">
          {{ props.title }}
        </slot>
      </div>
      <div class="er-collapse-item__icon-wrapper">
        <slot name="icon">
          <ErIcon icon="angle-right" class="header-angle" />
        </slot>
      </div>
    </div>
    <CollapseItemTransition>
      <div v-show="isActive" class="er-collapse-item__wrapper">
        <div
          class="er-collapse-item__content"
          :id="`er-collapse-item__content-${name}`"
        >
          <slot></slot>
        </div>
      </div>
    </CollapseItemTransition>
  </div>
</template>

<style scoped>
@import url("./style.css");
</style>
