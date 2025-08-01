import type { TooltipTriggerProps } from "../Trigger";
import { TOOLTIP_CTX_KEY } from "../contants";
import { inject, onMounted, ref, toRef } from "vue";
import { triggerWhen } from "../utils";
import type { PopperTriggerInstance } from "../../Popper/Trigger";
import { useClickOutside } from "@hyl-fake-element-plus/hooks";

export const useTrigger = (props: TooltipTriggerProps) => {
  const {
    onOpen,
    onHide,
    onToggle,
    virtualRef,
    virtualTrigger,
    trigger,
    shouldStop,
    controlled,
  } = inject(TOOLTIP_CTX_KEY, undefined)!;

  const popperTriggerRef = ref<PopperTriggerInstance | null>(null);

  const clickHandler = triggerWhen("click", trigger, onToggle);
  const onClick = (e: Event) => {
    if (controlled()) {
      return;
    }
    if (shouldStop()) {
      return;
    }
    clickHandler(e);
  };
  const mouseEnterHandler = triggerWhen("hover", trigger, onOpen);
  const onMouseEnter = (e: Event) => {
    console.log("onMouseEnter");

    if (controlled()) {
      return;
    }
    if (shouldStop()) {
      return;
    }
    console.log("onMouseEnter");
    mouseEnterHandler(e);
  };
  const mouseLeaveHandler = triggerWhen("hover", trigger, onHide);
  const onMouseLeave = (e: Event) => {
    if (controlled()) {
      return;
    }
    if (shouldStop()) {
      return;
    }
    mouseLeaveHandler(e);
  };
  const focusHandler = triggerWhen("focus", trigger, onOpen);
  const onFocus = (e: Event) => {
    if (controlled()) {
      return;
    }
    if (shouldStop()) {
      return;
    }
    focusHandler(e);
  };
  const blurHandler = triggerWhen("focus", trigger, onHide);
  const onBlur = (e: Event) => {
    if (controlled()) {
      return;
    }
    if (shouldStop()) {
      return;
    }
    blurHandler(e);
  };
  const onClickOutside = triggerWhen(["click", "focus"], trigger, onHide);

  onMounted(() => {
    if (!popperTriggerRef.value) {
      return;
    }
    const triggerRef = toRef(popperTriggerRef.value, "triggerRef");
    useClickOutside(triggerRef, onClickOutside);
  });

  return {
    onClick,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
    clickHandler,
    mouseEnterHandler,
    mouseLeaveHandler,
    focusHandler,
    blurHandler,
    virtualRef,
    virtualTrigger,
  };
};
