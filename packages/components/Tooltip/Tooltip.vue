<script setup lang="ts">
import HPopperContent from "../Popper/Content.vue";
import HTooltipTrigger from "./Trigger.vue";
import HPopper from "../Popper/Popper.vue";
import HPopperArrow from "../Popper/Arrow.vue";
import type { TooltipProps } from "./types";
import { provide, toRef, watch } from "vue";
import { TOOLTIP_CTX_KEY } from "./contants";
import TooltipTransition from "./TooltipTransition.vue";
import { useTooltip } from "./composables/useTooltip";
import { triggerWhen } from "./utils";
import { isBoolean } from "lodash-es";

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

const trigger = toRef(props, "trigger");

const controlled = () => {
  console.log("controlled:", props.visible);
  return isBoolean(props.visible);
};

const shouldStop = () => {
  console.log("shouldStop:", props.enterable, props.disabled);
  if (!props.enterable) return true;
  if (props.disabled) return true;
  return false;
};

const {
  visible,
  offsetModifier,
  doHide,
  doShow,
  toggle,
  delayedShow: show,
  delayedHide: hide,
} = useTooltip(props);

watch(
  () => props.visible,
  (val) => {
    if (!controlled()) {
      return;
    }
    val ? doShow() : doHide();
  },
  { immediate: true }
);

const hideWhenHover = triggerWhen("hover", trigger, hide);
const keepOpen = triggerWhen("hover", trigger, show);

const onMouseLeave = (e:Event) => {
  if (controlled()) {
    return;
  }
  if (shouldStop()) {
    return;
  }
  hideWhenHover(e);
};

const onMouseEnter = (e:Event) => {
  if (controlled()) {
    return;
  }
  if (shouldStop()) {
    return;
  }
  keepOpen(e);
};

provide(TOOLTIP_CTX_KEY, {
  visible,
  trigger,
  controlled,
  shouldStop,
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
            ['disabled']: props.disabled,
          }"
          :placement="placement"
          :popper-options="{
            modifiers: [offsetModifier],
          }"
          @mouseenter="onMouseLeave"
          @mouseleave="onMouseEnter"
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
