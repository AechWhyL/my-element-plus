import { mount } from "@vue/test-utils";
import { useClickOutside } from "../useClickOutside";
import { vi, it, describe, expect } from "vitest";
import { defineComponent, ref, nextTick } from "vue";

describe("useClickOutside", () => {
  it("should call callback when click outside", async () => {
    const callback = vi.fn();
    const wrapper = mount(
      defineComponent({
        setup() {
          const targetRef = ref<HTMLDivElement | null>(null);
          useClickOutside(targetRef, callback);
          return { targetRef };
        },
        template: `
            <div ref="targetRef"></div>
        `,
      })
    );
    await nextTick();

    document.dispatchEvent(new MouseEvent("mousedown"));
    expect(callback).toHaveBeenCalledTimes(1);

    wrapper.unmount();
    await nextTick();
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
