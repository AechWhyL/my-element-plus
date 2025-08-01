import { it, beforeAll, describe, test, vi, expect, type MockInstance, beforeEach, afterEach } from "vitest"
import { mount, DOMWrapper, VueWrapper } from "@vue/test-utils"

import Collapse from "@/components/Collapse/Collapse.vue"
import CollapseItem from "@/components/Collapse/CollapseItem.vue"

const onChange = vi.fn()

let wrapper: VueWrapper,
    headers: DOMWrapper<Element>[],
    contents: DOMWrapper<Element>[];

let firstHeader: DOMWrapper<Element>,
    firstContent: DOMWrapper<Element>,
    secondHeader: DOMWrapper<Element>,
    secondContent: DOMWrapper<Element>,
    disabledHeader: DOMWrapper<Element>,
    disabledContent: DOMWrapper<Element>;

const init = ({ accordion = false } = {}) => {
    wrapper = mount(Collapse,
        {
            props: {
                modelValue: ["1"],
                accordion,
                onChange
            },
            global: {
                stubs: {
                    ErIcon: true
                }
            },
            slots: {
                default: () => [
                    <CollapseItem name="1" title="content 1 title">
                        content 1
                    </CollapseItem>,
                    <CollapseItem name="2" title="content 2 title">
                        content 2
                    </CollapseItem>,
                    <CollapseItem name="3" title="content 3 title" disabled>
                        content 3
                    </CollapseItem>
                ]
            },
            attachTo: document.body
        }
    )
    onChange.mockClear()
    headers = wrapper.findAll(".er-collapse-item__header")
    contents = wrapper.findAll(".er-collapse-item__wrapper")

    firstHeader = headers[0]
    firstContent = contents[0]
    secondHeader = headers[1]
    secondContent = contents[1]
    disabledHeader = headers[2]
    disabledContent = contents[2]
}

describe("Collapse.vue", () => {
    let consoleSpy: MockInstance
    beforeAll(() => {
        init()
    })
    beforeEach(() => {
        consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => { })
    })
    afterEach(() => {
        consoleSpy && consoleSpy.mockRestore()
    })

    test("测试基本结构及文本", () => {

        expect(headers.length).toBe(3)
        expect(contents.length).toBe(3)
        expect(disabledHeader).toBeTruthy()
        expect(disabledContent).toBeTruthy()

        // titles
        expect(firstHeader.text()).toBe("content 1 title")
        expect(secondHeader.text()).toBe("content 2 title")
        expect(disabledHeader.text()).toBe("content 3 title")
        // contents
        expect(firstContent.text()).toBe("content 1")
        expect(secondContent.text()).toBe("content 2")
        expect(disabledContent.text()).toBe("content 3")

        // 展开，收起与禁止状态
        expect(firstHeader.classes()).toContain("er-collapse-item__header--active")
        expect(firstContent.isVisible()).toBeTruthy()

        expect(secondHeader.classes()).not.toContain("er-collapse-item__header--active")
        expect(secondContent.isVisible()).toBeFalsy()

        expect(disabledHeader.classes()).toContain("er-collapse-item__header--disabled")
        expect(disabledHeader.classes()).not.toContain("er-collapse-item__header--active")
        expect(disabledContent.isVisible()).toBeFalsy()
    })

    test("点击切换收起与展开状态", async () => {
        await firstHeader.trigger("click")
        expect(firstHeader.classes()).not.toContain("er-collapse-item__header--active")
        expect(firstContent.isVisible()).toBeFalsy()

        await secondHeader.trigger("click")
        expect(secondHeader.classes()).toContain("er-collapse-item__header--active")
        expect(secondContent.isVisible()).toBeTruthy()

        await disabledHeader.trigger("click")
        expect(disabledContent.isVisible()).toBeFalsy()
    })

    test("正确发送事件", () => {
        expect(onChange).toHaveBeenCalledTimes(2)
        expect(onChange).toHaveBeenLastCalledWith(["2"])

        onChange.mockClear()
        disabledHeader.trigger("click")
        expect(onChange).not.toHaveBeenCalled()
        expect(disabledContent.isVisible()).toBeFalsy()
    })

    test("modelValue 变更", async () => {
        await wrapper.setProps({
            modelValue: ["2"]
        })
        console.log(wrapper.findComponent(Collapse).props())
        expect(firstHeader.classes()).not.toContain("er-collapse-item__header--active")
        expect(firstContent.isVisible()).toBeFalsy()
        expect(secondHeader.classes()).toContain("er-collapse-item__header--active")
        expect(secondContent.isVisible()).toBeTruthy()
        expect(disabledHeader.classes()).not.toContain("er-collapse-item__header--active")
        expect(disabledContent.isVisible()).toBeFalsy()

        await wrapper.setProps({
            modelValue: ["1"]
        })
        expect(firstHeader.classes()).toContain("er-collapse-item__header--active")
        expect(firstContent.isVisible()).toBeTruthy()
        expect(secondHeader.classes()).not.toContain("er-collapse-item__header--active")
        expect(secondContent.isVisible()).toBeFalsy()
        expect(disabledHeader.classes()).not.toContain("er-collapse-item__header--active")
        expect(disabledContent.isVisible()).toBeFalsy()
    })

    test("手风琴模式", async () => {
        init({ accordion: true })
        expect(firstHeader.classes()).toContain("er-collapse-item__header--active")
        expect(firstContent.isVisible()).toBeTruthy()

        await secondHeader.trigger("click")

        expect(onChange).toHaveBeenCalledTimes(1)
        expect(onChange).toHaveBeenLastCalledWith(["2"])

        // 1自动收起
        expect(firstHeader.classes()).not.toContain("er-collapse-item__header--active")
        expect(firstContent.isVisible()).toBeFalsy()

        // 2展开
        expect(secondHeader.classes()).toContain("er-collapse-item__header--active")
        expect(secondContent.isVisible()).toBeTruthy()

        await secondHeader.trigger("click")
        expect(onChange).toHaveBeenCalledTimes(2)
        expect(onChange).toHaveBeenLastCalledWith([])

        // 2收起
        expect(secondHeader.classes()).not.toContain("er-collapse-item__header--active")
        expect(secondContent.isVisible()).toBeFalsy()

        await firstHeader.trigger("click")
        expect(onChange).toHaveBeenCalledTimes(3)
        expect(onChange).toHaveBeenLastCalledWith(["1"])

        expect(firstHeader.classes()).toContain("er-collapse-item__header--active")
        expect(firstContent.isVisible()).toBeTruthy()
        expect(secondHeader.classes()).not.toContain("er-collapse-item__header--active")
        expect(secondContent.isVisible()).toBeFalsy()
    })

    test("手风琴模式错误处理", () => {
        wrapper = mount(() => (
            <Collapse modelValue={["1", "2"]} onChange={onChange} accordion={true}>
                <CollapseItem name="1" title="content 1 title">
                    content 1
                </CollapseItem>
                <CollapseItem name="2" title="content 2 title">
                    content 2
                </CollapseItem>
                <CollapseItem name="3" title="content 3 title" disabled>
                    content 3
                </CollapseItem>
            </Collapse>
        ),
            {
                global: {
                    stubs: {
                        ErIcon: true
                    }
                },
                attachTo: document.body
            }
        )

        expect(consoleSpy).toHaveBeenCalled()
    })
})