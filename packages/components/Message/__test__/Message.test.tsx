import { describe, it, expect, vi, afterEach, test } from "vitest";
import { mount } from "@vue/test-utils";
import { ErIcon } from "../../Icon"
import Message from "../Message.vue";
import HMessage from "../Message";
import { nextTick, ref } from "vue";
import { MESSAGE_WRAPPER_CTX_KEY } from "../constants";
import type {  MessageEffect, MessageInstance, MessageProps, MessageType } from "../type";

describe("MessageInstance", () => {
    const createMessage = (props: MessageProps) => {
        const wrapper = mount(Message, {
            props,
            global: {
                provide: {
                    [MESSAGE_WRAPPER_CTX_KEY]: {
                        messageInstances: ref<MessageInstance[]>([]),
                        gap: ref(0),
                        messageRefs: ref<HTMLElement[]>([])
                    }
                },
                stubs: ["ErIcon"]
            }
        });
        return wrapper
    }
    // 基础渲染测试
    describe("基础渲染", () => {
        it("应该正确渲染消息内容", () => {
            const wrapper = createMessage({
                message: "这是一条测试消息",
            })

            expect(wrapper.text()).toContain("这是一条测试消息");
        });

        it("应该正确渲染默认类型", () => {
            const wrapper = createMessage({
                message: "测试消息",
            })

            expect(wrapper.classes()).toContain("h-message");
            expect(wrapper.classes()).toContain("h-message--info");
        });
    });

    // type属性测试
    describe("type属性", () => {
        it.each(["success", "info", "warning", "error"])(
            "应该正确应用%s类型样式",
            (type) => {
                const wrapper = createMessage({
                    type: type as MessageType,
                    message: `${type}消息`,
                })

                expect(wrapper.classes()).toContain(`h-message--${type}`);
            }
        );

        it("应该在没有type时使用默认info类型", () => {
            const wrapper = createMessage({
                message: "默认消息",
            })

            expect(wrapper.classes()).toContain("h-message--info");
        });
    });

    // message属性测试
    describe("message属性", () => {
        it("应该正确显示文本消息", () => {
            const wrapper = createMessage({
                message: "纯文本消息",
            })

            expect(wrapper.text()).toContain("纯文本消息");
        });

        // it('应该正确显示包含HTML的消息', () => {
        //   const wrapper = mount(Message, {
        //     props: {
        //       message: '<strong>加粗消息</strong>'
        //     }
        //   });

        //   expect(wrapper.html()).toContain('<strong>加粗消息</strong>');
        // });

        it("应该正确显示空消息", () => {
            const wrapper = createMessage({
                message: "",
            })

            expect(wrapper.text()).toBe("");
        });
    });

    // icon属性测试
    describe("icon属性", () => {
        it("应该正确显示自定义图标", () => {
            const wrapper = createMessage({
                message: "带图标的消息",
                icon: "check-circle",
            })

            const iconElement = wrapper.findComponent(ErIcon);
            expect(iconElement.exists()).toBe(true);
            expect(iconElement.props().icon).toBe("check-circle");
        });
    });

    // customClass属性测试
    describe("customClass属性", () => {
        it("应该正确应用自定义CSS类", () => {
            const wrapper = createMessage({
                message: "自定义样式消息",
                customClass: "my-custom-class",
            })

            expect(wrapper.classes()).toContain("my-custom-class");
        });

        it("应该支持多个自定义CSS类", () => {
            const wrapper = createMessage({
                message: "多类名消息",
                customClass: "class1 class2 class3",
            })

            expect(wrapper.classes()).toContain("class1");
            expect(wrapper.classes()).toContain("class2");
            expect(wrapper.classes()).toContain("class3");
        });

        it("应该在没有customClass时不添加额外类名", () => {
            const wrapper = createMessage({
                message: "无自定义类消息",
            })

            const baseClasses = ["h-message", "h-message--info"];
            baseClasses.forEach((className) => {
                expect(wrapper.classes()).toContain(className);
            });
        });

        it("应该正确处理包含特殊字符的类名", () => {
            const wrapper = createMessage({
                message: "特殊类名消息",
                customClass: "my-class--with-dashes my_class_with_underscores",
            })

            expect(wrapper.classes()).toContain("my-class--with-dashes");
            expect(wrapper.classes()).toContain("my_class_with_underscores");
        });
    });

    // effect属性测试
    describe("effect属性", () => {
        it.each(["light", "dark"])(
            "应该正确应用%s效果样式",
            (effect) => {
                const wrapper = createMessage({
                    message: `${effect}效果消息`,
                    effect: effect as MessageEffect,
                })
                expect(wrapper.classes()).toContain(`h-message--${effect}`);
            }
        );

        it("应该在没有effect时使用默认light效果", () => {
            const wrapper = createMessage({
                message: "默认效果消息",
            })

            expect(wrapper.classes()).toContain("h-message--light");
        });
    });

    // 组合属性测试
    describe("组合属性测试", () => {
        it("应该正确组合所有基本属性", () => {
            const wrapper = createMessage({
                    type: "warning",
                    message: "组合测试消息",
                    icon: "exclamation-triangle",
                customClass: "test-combination",
                effect: "dark",
            })

            expect(wrapper.classes()).toContain("h-message--warning");
            expect(wrapper.classes()).toContain("h-message--dark");
            expect(wrapper.classes()).toContain("test-combination");
            expect(wrapper.text()).toContain("组合测试消息");
        });

        it("应该正确处理type和icon的自动关联", () => {
            const wrapper = createMessage({
                type: "success",
                message: "自动图标消息",
            })

            // 当没有指定icon时，应该根据type自动显示对应图标
            const iconElement = wrapper.find(".h-message__icon");
            expect(iconElement.exists()).toBe(true);
        });
    });

    // 边界情况测试
    describe("边界情况测试", () => {
        it("应该正确处理空字符串作为customClass", () => {
            const wrapper = createMessage({
                message: "空类名消息",
                customClass: "",
            })

            const baseClasses = ["h-message", "h-message--info", "h-message--light"];
            baseClasses.forEach((className) => {
                expect(wrapper.classes()).toContain(className);
            });
        });
    });
});

describe("HMessage", () => {
    afterEach(() => {
        HMessage.clear()
    })
    
    it("should render message", async () => {
        HMessage({
            message: "test message"
        })
        await nextTick()
        const message = document.querySelector(".h-message")
        expect(message).toBeTruthy()
        expect(message?.textContent).toBe("test message")
        
        HMessage("test message 2")
        await nextTick()
        expect(document.querySelectorAll(".h-message").length).toBe(2)
    })

    test("clear and close", async () => {
        const message = HMessage({
            message: "test message"
        })
        HMessage({
            message: "test message 2"
        })
        await nextTick()
        expect(document.querySelectorAll(".h-message").length).toBe(2)
        HMessage.close(message.id)
        await nextTick()
        expect(document.querySelectorAll(".h-message").length).toBe(1)
        HMessage.clear()
        await nextTick()
        expect(document.querySelectorAll(".h-message").length).toBe(0)
    })

    test("自动间隔", async () => {
        HMessage({
            message: "test message"
        })
        HMessage({
            message: "test message 2"
        })
        await nextTick()
        const messages = document.querySelectorAll(".h-message")
        
        expect((messages[0] as HTMLElement).style.top).toBe("0px")
        expect((messages[1] as HTMLElement).style.top).not.toBe("0px")
    })

    test("自动关闭", async () => {
        vi.useFakeTimers()
        HMessage({
            message: "test message",
            duration: 1000
        })
        await nextTick()
        vi.runAllTimers()
        await nextTick()
        expect(document.querySelectorAll(".h-message").length).toBe(0)
    })
})
