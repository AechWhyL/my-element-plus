import { mount } from "@vue/test-utils";
import HPopperTrigger from "@/components/Popper/Trigger.vue";
import { describe, it, expect, vi } from "vitest"
import { POPPER_CTX_KEY } from "@/components/Popper/Popper";
import { ref } from "vue";
import type { PopperTriggerProps } from "@/components/Popper/Trigger";
import { nextTick } from "vue";

const child = "hyl"

const mountTrigger = (props?: PopperTriggerProps) => {
    return mount(HPopperTrigger, {
        props: { ...props },
        slots: {
            default: () => child
        },
        global: {
            provide: {
                [POPPER_CTX_KEY]: {
                    triggerRef: ref(null),
                    contentRef: ref(null)
                }
            },
        }
    })
}

describe("PopperTrigger.vue", () => {

    it("应该渲染插槽内容", () => {
        const wrapper = mountTrigger()

        expect(wrapper.text()).toBe(child)
    })

    it("应该能够正确绑定triggerRef", () => {
        const wrapper = mountTrigger({
            onClick: (e) => {
                e.stopPropagation()
            },
        })
        expect(wrapper.vm.triggerRef).not.toBe(null)
    })

    it("应该能够正确绑定虚拟triggerRef", async () => {
        const wrapper = mountTrigger({
            virtualTrigger: true,
        })
        expect(wrapper.vm.triggerRef).toBe(null)
        expect(wrapper.text()).not.toBe(child)

        const div = document.createElement("div")
        document.body.appendChild(div)
        await wrapper.setProps({
            virtualRef: div
        })
        expect(wrapper.vm.triggerRef).toStrictEqual(div)
    })

    it("应该能够绑定事件", async () => {
        const onClick = vi.fn()
        const onMouseenter = vi.fn()

        const div = document.createElement("div")
        document.body.appendChild(div)

        const wrapper = mountTrigger({
            virtualTrigger: true,
            virtualRef: div,
            onClick: (e) => {
                e.stopPropagation()
                onClick()
            },
            onMouseenter: (e) => {
                e.stopPropagation()
                onMouseenter()
            }
        })
        const clickEvt = new MouseEvent("click")
        const mouseEnterEvt = new MouseEvent("mouseenter")
        expect(onClick).not.toHaveBeenCalled()
        expect(onMouseenter).not.toHaveBeenCalled()
        wrapper.vm.triggerRef.dispatchEvent(clickEvt)
        wrapper.vm.triggerRef.dispatchEvent(mouseEnterEvt)
        await nextTick()
        expect(onClick).toHaveBeenCalled()
        expect(onMouseenter).toHaveBeenCalled()
    })

    it("触发元素更改时，应该要正确清除事件", async () => {
        const onClick = vi.fn()
        const onMouseenter = vi.fn()

        const div = document.createElement("div")
        document.body.appendChild(div)
        const wrapper = mountTrigger({
            virtualTrigger: true,
            virtualRef: div,
            onClick: (e) => {
                e.stopPropagation()
                onClick()
            },
            onMouseenter: (e) => {
                e.stopPropagation()
                onMouseenter()
            }
        })

        const div2 = document.createElement("div")
        document.body.appendChild(div2)
        await wrapper.setProps({
            virtualRef: div2
        })
        expect(wrapper.vm.triggerRef).toStrictEqual(div2)
        const clickEvt = new MouseEvent("click")
        const mouseEnterEvt = new MouseEvent("mouseenter")
        div.dispatchEvent(clickEvt)
        div.dispatchEvent(mouseEnterEvt)
        await nextTick()
        expect(onClick).not.toHaveBeenCalled()
        expect(onMouseenter).not.toHaveBeenCalled()
    })

    it("元素卸载时，应该要正确清除事件", async () => {
        const onClick = vi.fn()
        const onMouseenter = vi.fn()
        const div = document.createElement("div")
        document.body.appendChild(div)
        const wrapper = mountTrigger({
            virtualTrigger: true,
            virtualRef: div,
            onClick: (e) => {
                e.stopPropagation()
                onClick()
            },
            onMouseenter: (e) => {
                e.stopPropagation()
                onMouseenter()
            }
        })
        wrapper.unmount()
        const clickEvt = new MouseEvent("click")
        const mouseEnterEvt = new MouseEvent("mouseenter")
        div.dispatchEvent(clickEvt)
        div.dispatchEvent(mouseEnterEvt)
        expect(onClick).not.toHaveBeenCalled()
        expect(onMouseenter).not.toHaveBeenCalled()
    })
})
