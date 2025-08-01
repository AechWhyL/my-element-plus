import { useTooltip } from "@/components/Tooltip/composables/useTooltip";
import type { TooltipProps } from "@/components/Tooltip/types";
import { describe, expect, it, test, afterEach } from "vitest";
import { reactive, nextTick, unref } from "vue";

const defaultProps: TooltipProps = {
  offset: 12,
  effect: "dark",
  showArrow: true,
  transition: "fade",
  enterable: true,
  virtualTrigger: false,
  showDelay: 100,
  hideDelay: 100,
  disabled: false,
};

const props = reactive<TooltipProps>(defaultProps);


describe("useTooltip", () => {
  afterEach(() => {
    props.disabled = false;
    props.enterable = true;
  });

  it("should updating delays", async () => {
    const { showDelay, hideDelay } = useTooltip(props);
    expect(showDelay.value).toBe(100);
    expect(hideDelay.value).toBe(100);

    props.showDelay = undefined;
    props.hideDelay = undefined;
    await nextTick();
    expect(showDelay.value).toBe(0);
    expect(hideDelay.value).toBe(500);
  });

  test("can updating visible in default case", () => {
    const { visible, doShow, doHide, toggle } = useTooltip(props);
    expect(visible.value).toBe(false);
    doShow();
    expect(visible.value).toBe(true);
    doHide();
    expect(visible.value).toBe(false);
    toggle();
    expect(visible.value).toBe(true);
  });

  it("should return a popperjs modifier", () => {
    const { offsetModifier } = useTooltip(props);
    const modifier = unref(offsetModifier);
    expect(modifier).toBeDefined();
    const { name } = modifier;
    expect(name).toBe("offset");
    const { options } = modifier;
    expect(options.offset[1]).toEqual(props.offset);
  });

});
