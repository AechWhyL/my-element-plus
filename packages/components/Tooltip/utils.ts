import { unref, type Ref } from "vue";
import type { TooltipTriggerType } from "./Trigger";

export const isCorrectTrigger = (
  when: TooltipTriggerType,
  trigger: TooltipTriggerType
) => {
  return when === trigger;
};

export const triggerWhen = (
  when: TooltipTriggerType,
  triggerRef: Ref<TooltipTriggerType>,
  handler: (e: Event) => void
) => {
  return (e: Event) => {
    if (isCorrectTrigger(when, unref(triggerRef))) {
      handler(e);
    }
  };
};

export const triggerDelay = (
  show: () => void,
  hide: () => void,
  showDelay: Ref<number>,
  hideDelay: Ref<number>
) => {
  let showTimer: number;
  let hideTimer: number;

  const delayedShow = () => {
    if (hideTimer) {
      clearTimeout(hideTimer);
    }
    if (showTimer) {
      clearTimeout(showTimer);
    }
    showTimer = setTimeout(() => {
      show();
    }, unref(showDelay)) as unknown as number;
  };

  const delayedHide = () => {
    if (showTimer) {
      clearTimeout(showTimer);
    }
    if (hideTimer) {
      clearTimeout(hideTimer);
    }
    hideTimer = setTimeout(() => {
      hide();
    }, unref(hideDelay)) as unknown as number;
  };

  return {
    delayedShow,
    delayedHide,
  };
};
