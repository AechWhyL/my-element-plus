import { mount } from "@vue/test-utils";
import { describe, it, expect, test } from "vitest";
import HPopper from "@/components/Popper/Popper.vue";
import { defineComponent, inject, nextTick } from "vue";
import { POPPER_CTX_KEY } from "@/components/Popper/Popper";

const child = "hyl";

const TestChild = defineComponent({
  setup() {
    const { triggerRef, contentRef } = inject(POPPER_CTX_KEY, undefined)!;
    return () => (
      <template>
        <div ref={triggerRef}>{child}</div>
        <div ref={contentRef}>{child}</div>
      </template>
    );
  },
});

describe("Popper.vue", () => {
  it("应该提供触发元素以及内容元素", async () => {
    const wrapper = mount(
      <HPopper>
        <TestChild />
      </HPopper>
    );

    await nextTick();
    console.log(wrapper.vm);
    expect(wrapper.vm.triggerRef).not.toBe(null);
    expect(wrapper.vm.contentRef).not.toBe(null);
  });
});
