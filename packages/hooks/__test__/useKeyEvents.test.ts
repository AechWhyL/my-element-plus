import { mount } from "@vue/test-utils";
import { defineComponent, ref, nextTick, onMounted } from "vue";
import { vi, it, describe, expect, beforeEach, afterEach } from "vitest";
import { useKeyEvents } from "../useKeyEvents";

// 模拟键盘事件
const createKeyboardEvent = (
  key: string,
  options: {
    ctrlKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
    metaKey?: boolean;
    target?: HTMLElement;
    type?: 'keydown' | 'keyup' | 'keypress';
  } = {}
) => {
  const event = new KeyboardEvent(options.type || 'keydown', {
    key,
    ctrlKey: options.ctrlKey || false,
    shiftKey: options.shiftKey || false,
    altKey: options.altKey || false,
    metaKey: options.metaKey || false,
    bubbles: true,
    cancelable: true,
  });
  
  if (options.target) {
    Object.defineProperty(event, 'target', {
      value: options.target,
      writable: false
    });
  }
  
  return event;
};

describe("useKeyEvents", () => {
  let wrapper: ReturnType<typeof mount>;
  let targetElement: HTMLDivElement;
  let callback: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    targetElement = document.createElement('div');
    targetElement.setAttribute('tabindex', '0');
    document.body.appendChild(targetElement);
    callback = vi.fn();
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
    if (targetElement && targetElement.parentNode) {
      targetElement.parentNode.removeChild(targetElement);
    }
    vi.clearAllMocks();
  });

  describe("基础功能测试", () => {
    it("应该能够绑定键盘事件到指定元素", async () => {
      const TestComponent = defineComponent({
        setup() {
          const targetRef = ref<HTMLDivElement | null>(null);
          
          onMounted(() => {
            targetRef.value = targetElement;
          });

          const { bindKeyboardEvents } = useKeyEvents({
            target: targetRef,
            keys: ['Enter'],
            onKeyDown: { 'Enter': callback }
          });

          bindKeyboardEvents();

          return { targetRef };
        },
        template: '<div ref="targetRef"></div>'
      });

      wrapper = mount(TestComponent);
      await nextTick();

      targetElement.focus();
      targetElement.dispatchEvent(createKeyboardEvent('Enter'));
      
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("应该支持多个按键绑定", async () => {
      const enterCallback = vi.fn();
      const escapeCallback = vi.fn();

      const TestComponent = defineComponent({
        setup() {
          const targetRef = ref<HTMLDivElement | null>(null);
          
          onMounted(() => {
            targetRef.value = targetElement;
          });

          const { bindKeyboardEvents } = useKeyEvents({
            target: targetRef,
            keys: ['Enter', 'Escape'],
            onKeyDown: { 
              'Enter': enterCallback,
              'Escape': escapeCallback
            }
          });

          bindKeyboardEvents();

          return { targetRef };
        },
        template: '<div ref="targetRef"></div>'
      });

      wrapper = mount(TestComponent);
      await nextTick();

      targetElement.focus();
      targetElement.dispatchEvent(createKeyboardEvent('Enter'));
      targetElement.dispatchEvent(createKeyboardEvent('Escape'));
      
      expect(enterCallback).toHaveBeenCalledTimes(1);
      expect(escapeCallback).toHaveBeenCalledTimes(1);
    });

    it("应该支持不同的事件类型", async () => {
      const keydownCallback = vi.fn();
      const keyupCallback = vi.fn();

      const TestComponent = defineComponent({
        setup() {
          const targetRef = ref<HTMLDivElement | null>(null);
          
          onMounted(() => {
            targetRef.value = targetElement;
          });

          const { bindKeyboardEvents } = useKeyEvents({
            target: targetRef,
            keys: ['Space'],
            onKeyDown: { 'Space': keydownCallback },
            onKeyUp: { 'Space': keyupCallback }
          });

          bindKeyboardEvents();

          return { targetRef };
        },
        template: '<div ref="targetRef"></div>'
      });

      wrapper = mount(TestComponent);
      await nextTick();

      targetElement.focus();
      targetElement.dispatchEvent(createKeyboardEvent('Space', { type: 'keydown' }));
      targetElement.dispatchEvent(createKeyboardEvent('Space', { type: 'keyup' }));
      
      expect(keydownCallback).toHaveBeenCalledTimes(1);
      expect(keyupCallback).toHaveBeenCalledTimes(1);
    });
  });

  describe("修饰键支持测试", () => {
    it("应该支持Ctrl修饰键组合", async () => {
      const TestComponent = defineComponent({
        setup() {
          const targetRef = ref<HTMLDivElement | null>(null);
          
          onMounted(() => {
            targetRef.value = targetElement;
          });

          const { bindKeyboardEvents } = useKeyEvents({
            target: targetRef,
            keys: ['s'],
            modifiers: { ctrl: true },
            onKeyDown: { 'Ctrl+s': callback }
          });

          bindKeyboardEvents();

          return { targetRef };
        },
        template: '<div ref="targetRef"></div>'
      });

      wrapper = mount(TestComponent);
      await nextTick();

      targetElement.focus();
      targetElement.dispatchEvent(createKeyboardEvent('s', { ctrlKey: true }));
      
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("应该支持多个修饰键组合", async () => {
      const TestComponent = defineComponent({
        setup() {
          const targetRef = ref<HTMLDivElement | null>(null);
          
          onMounted(() => {
            targetRef.value = targetElement;
          });

          const { bindKeyboardEvents } = useKeyEvents({
            target: targetRef,
            keys: ['z'],
            modifiers: { ctrl: true, shift: true },
            onKeyDown: { 'Ctrl+Shift+z': callback }
          });

          bindKeyboardEvents();

          return { targetRef };
        },
        template: '<div ref="targetRef"></div>'
      });

      wrapper = mount(TestComponent);
      await nextTick();

      targetElement.focus();
      targetElement.dispatchEvent(createKeyboardEvent('z', { ctrlKey: true, shiftKey: true }));
      
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("应该区分不同的修饰键组合", async () => {
      const ctrlSCallback = vi.fn();
      const ctrlShiftSCallback = vi.fn();

      const TestComponent = defineComponent({
        setup() {
          const targetRef = ref<HTMLDivElement | null>(null);
          
          onMounted(() => {
            targetRef.value = targetElement;
          });

          const { bindKeyboardEvents } = useKeyEvents({
            target: targetRef,
            keys: ['s'],
            onKeyDown: { 
              'Ctrl+s': ctrlSCallback,
              'Ctrl+Shift+s': ctrlShiftSCallback
            }
          });

          bindKeyboardEvents();

          return { targetRef };
        },
        template: '<div ref="targetRef"></div>'
      });

      wrapper = mount(TestComponent);
      await nextTick();

      targetElement.focus();
      targetElement.dispatchEvent(createKeyboardEvent('s', { ctrlKey: true }));
      targetElement.dispatchEvent(createKeyboardEvent('s', { ctrlKey: true, shiftKey: true }));
      
      expect(ctrlSCallback).toHaveBeenCalledTimes(1);
      expect(ctrlShiftSCallback).toHaveBeenCalledTimes(1);
    });
  });

  describe("全局事件测试", () => {
    it("应该支持全局键盘事件监听", async () => {
      const TestComponent = defineComponent({
        setup() {
          const { bindGlobalEvents } = useKeyEvents({
            keys: ['F1'],
            global: true,
            onKeyDown: { 'F1': callback }
          });

          bindGlobalEvents();

          return {};
        },
        template: '<div></div>'
      });

      wrapper = mount(TestComponent);
      await nextTick();

      document.dispatchEvent(createKeyboardEvent('F1'));
      
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("全局事件应该在任何元素获得焦点时都能触发", async () => {
      const TestComponent = defineComponent({
        setup() {
          const { bindGlobalEvents } = useKeyEvents({
            keys: ['F2'],
            global: true,
            onKeyDown: { 'F2': callback }
          });

          bindGlobalEvents();

          return {};
        },
        template: '<div></div>'
      });

      wrapper = mount(TestComponent);
      await nextTick();

      // 即使其他元素获得焦点，全局事件也应该触发
      targetElement.focus();
      document.dispatchEvent(createKeyboardEvent('F2'));
      
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe("事件管理测试", () => {
    it("应该能够动态添加键盘监听器", async () => {
      const newCallback = vi.fn();

      const TestComponent = defineComponent({
        setup() {
          const targetRef = ref<HTMLDivElement | null>(null);
          
          onMounted(() => {
            targetRef.value = targetElement;
          });

          const { bindKeyboardEvents, addKeyListener } = useKeyEvents({
            target: targetRef,
            keys: ['Enter'],
            onKeyDown: { 'Enter': callback }
          });

          bindKeyboardEvents();

          // 动态添加新的监听器
          addKeyListener('Space', newCallback, 'keydown');

          return { targetRef };
        },
        template: '<div ref="targetRef"></div>'
      });

      wrapper = mount(TestComponent);
      await nextTick();

      targetElement.focus();
      targetElement.dispatchEvent(createKeyboardEvent('Enter'));
      targetElement.dispatchEvent(createKeyboardEvent('Space'));
      
      expect(callback).toHaveBeenCalledTimes(1);
      expect(newCallback).toHaveBeenCalledTimes(1);
    });

    it("应该能够移除键盘监听器", async () => {
      const TestComponent = defineComponent({
        setup() {
          const targetRef = ref<HTMLDivElement | null>(null);
          
          onMounted(() => {
            targetRef.value = targetElement;
          });

          const { bindKeyboardEvents, removeKeyListener } = useKeyEvents({
            target: targetRef,
            keys: ['Enter', 'Space'],
            onKeyDown: { 
              'Enter': callback,
              'Space': callback
            }
          });

          bindKeyboardEvents();

          // 移除Space键监听器
          removeKeyListener('Space');

          return { targetRef };
        },
        template: '<div ref="targetRef"></div>'
      });

      wrapper = mount(TestComponent);
      await nextTick();

      targetElement.focus();
      targetElement.dispatchEvent(createKeyboardEvent('Enter'));
      targetElement.dispatchEvent(createKeyboardEvent('Space'));
      
      expect(callback).toHaveBeenCalledTimes(1); // 只有Enter被触发
    });

    it("应该能够清理所有监听器", async () => {
      const TestComponent = defineComponent({
        setup() {
          const targetRef = ref<HTMLDivElement | null>(null);
          
          onMounted(() => {
            targetRef.value = targetElement;
          });

          const { bindKeyboardEvents, destroy } = useKeyEvents({
            target: targetRef,
            keys: ['Enter'],
            onKeyDown: { 'Enter': callback }
          });

          bindKeyboardEvents();

          // 清理所有监听器
          destroy();

          return { targetRef };
        },
        template: '<div ref="targetRef"></div>'
      });

      wrapper = mount(TestComponent);
      await nextTick();

      targetElement.focus();
      targetElement.dispatchEvent(createKeyboardEvent('Enter'));
      
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe("按键状态追踪测试", () => {
    it("应该能够追踪按键按下状态", async () => {
      const TestComponent = defineComponent({
        setup() {
          const targetRef = ref<HTMLDivElement | null>(null);
          
          onMounted(() => {
            targetRef.value = targetElement;
          });

          const { bindKeyboardEvents, isPressed, pressedKeys } = useKeyEvents({
            target: targetRef,
            keys: ['Shift', 'Ctrl'],
            onKeyDown: { 'Shift': callback, 'Ctrl': callback }
          });

          bindKeyboardEvents();

          return { targetRef, isPressed, pressedKeys };
        },
        template: '<div ref="targetRef"></div>'
      });

      wrapper = mount(TestComponent);
      await nextTick();

      const vm = wrapper.vm as any;
      
      targetElement.focus();
      targetElement.dispatchEvent(createKeyboardEvent('Shift', { shiftKey: true }));
      
      expect(vm.isPressed).toBe(true);
      expect(vm.pressedKeys).toContain('Shift');
    });

    it("应该能够追踪多个按键同时按下的状态", async () => {
      const TestComponent = defineComponent({
        setup() {
          const targetRef = ref<HTMLDivElement | null>(null);
          
          onMounted(() => {
            targetRef.value = targetElement;
          });

          const { bindKeyboardEvents, pressedKeys } = useKeyEvents({
            target: targetRef,
            keys: ['Shift', 'Ctrl', 'Alt'],
            onKeyDown: { 
              'Shift': callback, 
              'Ctrl': callback,
              'Alt': callback
            }
          });

          bindKeyboardEvents();

          return { targetRef, pressedKeys };
        },
        template: '<div ref="targetRef"></div>'
      });

      wrapper = mount(TestComponent);
      await nextTick();

      const vm = wrapper.vm as any;
      
      targetElement.focus();
      targetElement.dispatchEvent(createKeyboardEvent('Shift', { shiftKey: true }));
      targetElement.dispatchEvent(createKeyboardEvent('Ctrl', { ctrlKey: true }));
      
      expect(vm.pressedKeys).toContain('Shift');
      expect(vm.pressedKeys).toContain('Ctrl');
      expect(vm.pressedKeys).toHaveLength(2);
    });
  });

  describe("生命周期管理测试", () => {
    it("组件卸载时应该自动清理事件监听器", async () => {
      const TestComponent = defineComponent({
        setup() {
          const targetRef = ref<HTMLDivElement | null>(null);
          
          onMounted(() => {
            targetRef.value = targetElement;
          });

          const { bindKeyboardEvents } = useKeyEvents({
            target: targetRef,
            keys: ['Enter'],
            onKeyDown: { 'Enter': callback }
          });

          bindKeyboardEvents();

          return { targetRef };
        },
        template: '<div ref="targetRef"></div>'
      });

      wrapper = mount(TestComponent);
      await nextTick();

      targetElement.focus();
      targetElement.dispatchEvent(createKeyboardEvent('Enter'));
      expect(callback).toHaveBeenCalledTimes(1);

      // 卸载组件
      wrapper.unmount();
      await nextTick();

      // 事件监听器应该被清理
      targetElement.dispatchEvent(createKeyboardEvent('Enter'));
      expect(callback).toHaveBeenCalledTimes(1); // 不应该再被调用
    });
  });

  describe("错误处理测试", () => {
    it("应该优雅处理无效的目标元素", async () => {
      const TestComponent = defineComponent({
        setup() {
          const targetRef = ref<HTMLDivElement | null>(null);

          const { bindKeyboardEvents } = useKeyEvents({
            target: targetRef,
            keys: ['Enter'],
            onKeyDown: { 'Enter': callback }
          });

          // 尝试绑定到null元素
          bindKeyboardEvents();

          return { targetRef };
        },
        template: '<div></div>'
      });

      wrapper = mount(TestComponent);
      await nextTick();

      // 不应该抛出错误
      expect(() => {
        document.dispatchEvent(createKeyboardEvent('Enter'));
      }).not.toThrow();
    });

    it("应该处理重复绑定事件的情况", async () => {
      const TestComponent = defineComponent({
        setup() {
          const targetRef = ref<HTMLDivElement | null>(null);
          
          onMounted(() => {
            targetRef.value = targetElement;
          });

          const { bindKeyboardEvents } = useKeyEvents({
            target: targetRef,
            keys: ['Enter'],
            onKeyDown: { 'Enter': callback }
          });

          // 多次绑定应该不会重复添加监听器
          bindKeyboardEvents();
          bindKeyboardEvents();
          bindKeyboardEvents();

          return { targetRef };
        },
        template: '<div ref="targetRef"></div>'
      });

      wrapper = mount(TestComponent);
      await nextTick();

      targetElement.focus();
      targetElement.dispatchEvent(createKeyboardEvent('Enter'));
      
      // 应该只触发一次
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });
});
