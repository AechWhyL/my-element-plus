import HTooltip from "@/components/Tooltip/Tooltip.vue";
import HPopperContent from "@/components/Popper/Content.vue";
import HTrigger from "@/components/Tooltip/Trigger.vue";
import type { TooltipProps } from "@/components/Tooltip/types";
import { mount } from "@vue/test-utils";
import { test, describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { nextTick } from "vue";

const testContent = "testContent";
const testTriggerChild = "click me";

describe("Tooltip.vue", () => {
    let wrapper: ReturnType<typeof mount>;
    const createTooltip = (props: TooltipProps, slots = {}) => {
        wrapper = mount(HTooltip, {
            props,
            slots: {
                default: <div>{testTriggerChild}</div>,
                ...slots,
            },
            global: {
                stubs: {
                    TooltipTransition: {
                        template: `<slot />`,
                    },
                },
            },
            attachTo: document.body,
        });
    };
    describe("rendering", () => {
        beforeEach(async () => {
            createTooltip({});
            await nextTick();
        });
        afterEach(() => {
            wrapper.unmount();
        });

        it("should render trigger and content", () => {
            createTooltip({
                content: testContent,
                showDelay: 0,
                hideDelay: 0,
            });
            const trigger = wrapper.findComponent(HTrigger);
            const content = wrapper.find(".h-tooltip-content");
            expect(trigger.exists()).toBe(true);
            expect(content.exists()).toBe(true);
            expect(content.text()).toBe(testContent);
        });

        it("should render slots", () => {
            createTooltip(
                {
                    content: testContent,
                    showDelay: 0,
                    hideDelay: 0,
                },
                {
                    default: () => {
                        return <div>{testTriggerChild}</div>;
                    },
                    content: () => {
                        return <div>{testContent}</div>;
                    },
                }
            );
            expect(wrapper.find(".h-tooltip-content").text()).toBe(testContent);
            expect(wrapper.find(".h-tooltip-trigger").text()).toBe(testTriggerChild);
        });
    });

    describe("visible", () => {
        beforeEach(() => {
            vi.useFakeTimers();
        })
        afterEach(() => {
            vi.useRealTimers();
        })

        test("hover", async () => {
            vi.useFakeTimers();
            createTooltip({
                visible: undefined,
                content: testContent,
                showDelay: 0,
                hideDelay: 0,
                trigger: "hover",
            });
            const trigger = wrapper.findComponent(HTrigger);
            const content = wrapper.find(".h-tooltip-content");

            await trigger.trigger("mouseenter");
            vi.runAllTimers();
            await nextTick()
            expect(content.isVisible()).toBe(true);

            await trigger.trigger("mouseleave");
            vi.runAllTimers();
            await nextTick();
            expect(content.isVisible()).toBe(false);

        });

        test("click", async () => {
            createTooltip({
                visible: undefined,
                content: testContent,
                showDelay: 0,
                hideDelay: 0,
                trigger: "click",
            });
            const trigger = wrapper.findComponent(HTrigger);
            const content = wrapper.find(".h-tooltip-content");

            await trigger.trigger("click");
            vi.runAllTimers();
            await nextTick()
            expect(content.isVisible()).toBe(true);

            await trigger.trigger("click");
            vi.runAllTimers();
            await nextTick();
            expect(content.isVisible()).toBe(false);

            document.body.click();
            vi.runAllTimers();
            await nextTick();
            expect(content.isVisible()).toBe(false);
        });

        test("focus", async () => {
            createTooltip({
                visible: undefined,
                content: testContent,
                showDelay: 0,
                hideDelay: 0,
                trigger: "focus",
            });
            const trigger = wrapper.findComponent(HTrigger);
            const content = wrapper.find(".h-tooltip-content");

            await trigger.trigger("focus");
            vi.runAllTimers();
            await nextTick()
            expect(content.isVisible()).toBe(true);

            await trigger.trigger("blur");
            vi.runAllTimers();
            await nextTick();
            expect(content.isVisible()).toBe(false);
        });

        test("keep visible when hovering", async () => {
            createTooltip({
                visible: undefined,
                content: testContent,
                showDelay: 0,
                hideDelay: 500,
                trigger: "hover",
            });
            const trigger = wrapper.findComponent(HTrigger);
            const content = wrapper.find(".h-tooltip-content");

            await trigger.trigger("mouseenter");
            vi.runAllTimers();
            await nextTick()
            expect(content.isVisible()).toBe(true);

            await trigger.trigger("mouseleave");
            vi.advanceTimersByTime(200);
            await trigger.trigger("mouseenter")
            vi.runAllTimers()
            await nextTick();
            expect(content.isVisible()).toBe(true);
        })

        it("content should be invisible initialy by default", () => {
            createTooltip({
                content: testContent,
                showDelay: 0,
                hideDelay: 0,
            });
            const content = wrapper.find(".h-tooltip-content");
            expect(content.isVisible()).toBe(false);
        });

        it("should be able to controll visible by props.visible", async () => {
            createTooltip({
                content: testContent,
                showDelay: 0,
                hideDelay: 0,
            });
            const popper = wrapper.findComponent(HPopperContent);
            await wrapper.setProps({ visible: true });
            await nextTick();
            expect(popper.isVisible()).toBe(true);
            await wrapper.setProps({ visible: false });
            await nextTick();
            expect(popper.isVisible()).toBe(false);
        });

    });
});
