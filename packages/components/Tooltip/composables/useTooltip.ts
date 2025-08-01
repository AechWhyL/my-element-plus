import { computed, onMounted, ref, toRef, unref, watch, type Ref } from "vue";
import type { TooltipProps } from "../types";
import { triggerDelay, triggerWhen } from "../utils";

export const useTooltip = (props: TooltipProps) => {
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

  const doShow = () => {
    visible.value = true;
  };

  const doHide = () => {
    visible.value = false;
  };

  const toggle = () => {
    visible.value = !visible.value;
  };

  const { delayedShow, delayedHide } = triggerDelay(
    doShow,
    doHide,
    showDelay,
    hideDelay
  );

  return {
    visible,
    offsetModifier,
    showDelay,
    hideDelay,
    delayedShow,
    delayedHide,
    doShow,
    doHide,
    toggle,
  };
};
