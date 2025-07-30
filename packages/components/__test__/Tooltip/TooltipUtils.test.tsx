import {
  triggerWhen,
  isCorrectTrigger,
  triggerDelay,
} from "@/components/Tooltip/utils";
import { vi, describe, test, expect, beforeEach, it } from "vitest";
import { ref, unref } from "vue";
import type { TooltipTriggerType } from "@/components/Tooltip/Trigger";

const trigger = ref<TooltipTriggerType>("click");

describe("TooltipUtils/triggerWhen", () => {
  beforeEach(() => {
    trigger.value = "click";
  });

  test("isCorrectTrigger", () => {
    expect(isCorrectTrigger("hover", unref(trigger))).not.toBeTruthy();
    expect(isCorrectTrigger("click", unref(trigger))).toBeTruthy();
  });
  test("triggerWhen", () => {
    const e = new Event("click");
    const fn = vi.fn();
    const newFn = triggerWhen("click", trigger, fn);
    newFn(e);
    expect(fn).toHaveBeenCalledTimes(1);
    trigger.value = "hover";
    newFn(e);
    expect(fn).toHaveBeenCalledTimes(1);
  });
  test("can change behavior", () => {
    const e = new Event("click");
    const hoverFnSpy = vi.fn();
    const clickFnSpy = vi.fn();
    const hoverFn = triggerWhen("hover", trigger, hoverFnSpy);
    const clickFn = triggerWhen("click", trigger, clickFnSpy);
    clickFn(e);
    expect(hoverFnSpy).toHaveBeenCalledTimes(0);
    expect(clickFnSpy).toHaveBeenCalledTimes(1);
    trigger.value = "hover";
    hoverFn(e);
    expect(hoverFnSpy).toHaveBeenCalledTimes(1);
    expect(clickFnSpy).toHaveBeenCalledTimes(1);
  });
});

describe("TooltipUtils/triggerDelay", () => {
  const showDelayRef = ref(100);
  const hideDelayRef = ref(100);

  beforeEach(() => {
    showDelayRef.value = 100;
    hideDelayRef.value = 100;
  });

  it("should delay show/hide", async () => {
    const show = vi.fn();
    const hide = vi.fn();
    console.log(triggerDelay(show, hide, showDelayRef, hideDelayRef));
    const { delayedShow, delayedHide } = triggerDelay(
      show,
      hide,
      showDelayRef,
      hideDelayRef
    );
    delayedShow();
    expect(show).toHaveBeenCalledTimes(0);
    await new Promise((resolve) => setTimeout(resolve, 150));
    expect(show).toHaveBeenCalledTimes(1);

    delayedHide();
    expect(hide).toHaveBeenCalledTimes(0);
    await new Promise((resolve) => setTimeout(resolve, 150));
    expect(hide).toHaveBeenCalledTimes(1);
  });

  it("should cancel the other pending show/hide when hide/show triggers", async () => {
    const showDelay = 200;
    const hideDelay = 300;
    const show = vi.fn();
    const hide = vi.fn();
    showDelayRef.value = showDelay;
    hideDelayRef.value = hideDelay;
    const { delayedShow, delayedHide } = triggerDelay(
      show,
      hide,
      showDelayRef,
      hideDelayRef
    );
    delayedShow();
    await new Promise((resolve) => setTimeout(resolve, 100));
    delayedHide();
    await new Promise((resolve) => setTimeout(resolve, hideDelay));
    expect(show).toHaveBeenCalledTimes(0);
    expect(hide).toHaveBeenCalledTimes(1);

    show.mockClear();
    hide.mockClear();

    delayedHide();
    await new Promise((resolve) => setTimeout(resolve, 100));
    delayedShow();
    await new Promise((resolve) => setTimeout(resolve, showDelay));
    expect(hide).toHaveBeenCalledTimes(0);
    expect(show).toHaveBeenCalledTimes(1);
  });
});
