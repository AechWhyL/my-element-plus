import { vi, test, expect, describe, beforeEach, afterEach } from "vitest";
import { useTrigger } from "@/components/Tooltip/composables/useTrigger";
import { defineComponent, nextTick, ref } from "vue";
import { mount } from "@vue/test-utils";
import type { TooltipProps } from "../../Tooltip/types";
import { TOOLTIP_CTX_KEY } from "../../Tooltip/contants";

const TestComp = defineComponent({
  setup() {
    const {
      onBlur,
      onClick,
      onFocus,
      onMouseEnter,
      onMouseLeave,
      clickHandler,
      mouseEnterHandler,
      mouseLeaveHandler,
      focusHandler,
      blurHandler,
      virtualRef,
      virtualTrigger,
    } = useTrigger({});
    return {
      onBlur,
      onClick,
      onFocus,
      onMouseEnter,
      onMouseLeave,
      clickHandler,
      mouseEnterHandler,
      mouseLeaveHandler,
      focusHandler,
      blurHandler,
      virtualRef,
      virtualTrigger,
    };
  },
  render() {
    return "<div/>";
  },
});

const onOpen = vi.fn();
const onHide = vi.fn();
const onToggle = vi.fn();
const virtualRef = ref();
const virtualTrigger = ref();
const trigger = ref("hover");
const controlled = vi.fn()
const shouldStop = vi.fn();

const provides = {
  [TOOLTIP_CTX_KEY]: {
    onOpen,
    onHide,
    onToggle,
    controlled,
    virtualRef,
    virtualTrigger,
    trigger,
    shouldStop,
  },
};

let wrapper: ReturnType<typeof mount>;

const mountTestComp = (props: TooltipProps = {}) => {
  wrapper = mount(TestComp, {
    props,
    global: {
      provide: {
        ...provides,
      },
    },
  });
};

const clearMocks = () => {
  onOpen.mockClear();
  onHide.mockClear();
  onToggle.mockClear();
}

describe("useTrigger", () => {
  beforeEach(async () => {
    vi.useFakeTimers();
    mountTestComp();
    await nextTick();
  });

  afterEach(() => {
    wrapper.unmount()
    clearMocks()
    vi.clearAllTimers();
  });

  test("uncontrolled", async () => {
    controlled.mockReturnValue(false);
    const { vm } = (wrapper as unknown as { vm: ReturnType<typeof useTrigger> });
    trigger.value = "hover";
    await nextTick();
    vm.onMouseEnter(new MouseEvent("mouseenter"));
    expect(onOpen).toHaveBeenCalled();
    vm.onMouseLeave(new MouseEvent("mouseleave"));
    expect(onHide).toHaveBeenCalled();

    clearMocks()
    trigger.value = "click";
    await nextTick();
    vm.onClick(new MouseEvent("click"));
    expect(onToggle).toHaveBeenCalled();

    clearMocks()
    trigger.value = "focus";
    await nextTick();
    vm.onFocus(new Event("focus"));
    expect(onOpen).toHaveBeenCalled();
    vm.onBlur(new Event("blur"));
    expect(onHide).toHaveBeenCalled();
  });

  test("controlled", async () => {
    controlled.mockReturnValue(true);
    const { vm } = (wrapper as unknown as { vm: ReturnType<typeof useTrigger> });
    trigger.value = "hover";
    await nextTick();
    vm.onMouseEnter(new MouseEvent("mouseenter"));
    expect(onOpen).not.toHaveBeenCalled();
    vm.onMouseLeave(new MouseEvent("mouseleave"));
    expect(onHide).not.toHaveBeenCalled();

    clearMocks()
    trigger.value = "click";
    await nextTick();
    vm.onClick(new MouseEvent("click"));
    expect(onToggle).not.toHaveBeenCalled();

    clearMocks()
    trigger.value = "focus";
    await nextTick();
    vm.onFocus(new Event("focus"));
    expect(onOpen).not.toHaveBeenCalled();
    vm.onBlur(new Event("blur"));
    expect(onHide).not.toHaveBeenCalled();
  });

  test("should stop", async () => {
    const { vm } = (wrapper as unknown as { vm: ReturnType<typeof useTrigger> });
    controlled.mockReturnValue(false);
    shouldStop.mockReturnValue(true);

    trigger.value = "click";
    await nextTick();
    vm.onClick(new MouseEvent("click"));
    expect(onToggle).not.toHaveBeenCalled();
    
    trigger.value = "hover";
    await nextTick();
    vm.onMouseEnter(new MouseEvent("mouseenter"));
    expect(onOpen).not.toHaveBeenCalled();
    vm.onMouseLeave(new MouseEvent("mouseleave"));
    expect(onHide).not.toHaveBeenCalled();

    trigger.value = "focus";
    await nextTick();
    vm.onFocus(new Event("focus"));
    expect(onOpen).not.toHaveBeenCalled();
    vm.onBlur(new Event("blur"));
    expect(onHide).not.toHaveBeenCalled();
  })
});
