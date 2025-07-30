<script setup lang="ts">
import HPopperContent from "../Popper/Content.vue";
import HTooltipTrigger from "./Trigger.vue";
import HPopper from "../Popper/Popper.vue";
import HPopperArrow from "../Popper/Arrow.vue";
import type { TooltipProps } from "./types";
import { computed, onMounted, provide, ref, toRef, watch } from "vue";
import { TOOLTIP_CTX_KEY } from "./contants";
import { triggerDelay } from "./utils";
import TooltipTransition from "./TooltipTransition.vue";

defineOptions({
  name: "HTooltip",
});

const props = withDefaults(defineProps<TooltipProps>(), {
  offset: 12,
  effect: "dark",
  trigger: "hover",
  showArrow: true,
  enterable: true,
  virtualTrigger: false,
});

const visible = ref(false);

const offsetModifier = computed(() => {
  return {
    name: "offset",
    options: {
      offset: [0, props.offset],
    },
  };
});

const showDelay = computed(() =>
  props.showDelay !== undefined ? props.showDelay : 0
);
const hideDelay = computed(() =>
  props.hideDelay !== undefined ? props.hideDelay : 500
);

const isInside = ref(false);

const shouldStop = () => {
  if (!props.enterable) return false;
  if (props.disabled || isInside.value) return true;
};

const doShow = () => {
  if (shouldStop()) return;
  visible.value = true;
};

const doHide = () => {
  if (shouldStop()) return;
  visible.value = false;
};

const toggle = () => {
  if (shouldStop()) return;
  visible.value = !visible.value;
};

const { delayedShow: show, delayedHide: hide } = triggerDelay(
  doShow,
  doHide,
  showDelay,
  hideDelay
);

onMounted(() => {
  watch(
    () => props.visible,
    (val) => {
      if (val !== undefined) {
        visible.value = val;
      }
    }
  );
});

provide(TOOLTIP_CTX_KEY, {
  onOpen: show,
  onHide: hide,
  onToggle: toggle,
  virtualRef: toRef(props, "virtualRef"),
  virtualTrigger: toRef(props, "virtualTrigger"),
});
</script>

<template>
  <HPopper>
    <div class="h-tooltip">
      <HTooltipTrigger :trigger="props.trigger">
        <slot></slot>
      </HTooltipTrigger>
      <TooltipTransition :transition="props.transition">
        <HPopperContent
          v-show="visible"
          class="h-tooltip-content"
          :class="{
            [`${props.effect}`]: effect,
            [`${contentClass}`]: contentClass,
            ['disabled']: props.disabled
          }"
          :placement="placement"
          :popper-options="{
            modifiers: [offsetModifier],
          }"
          @mouseenter="isInside = true"
          @mouseleave="isInside = false"
        >
          <HPopperArrow v-show="showArrow" class="h-tooltip-arrow" />
          <slot name="content">
            {{ props.content }}
          </slot>
        </HPopperContent>
      </TooltipTransition>
    </div>
  </HPopper>
</template>

<style scoped>
@import url("./style.scss");
</style>
