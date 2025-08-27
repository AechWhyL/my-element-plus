import { FORM_CONTEXT_KEY } from "@hyl-fake-element-plus/components/Form/constants";
import type { FormContext, InternalFormItemContext } from "@hyl-fake-element-plus/components/Form/type";
import { useDisabled } from "../index";
import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, test } from "vitest";
import { defineComponent, nextTick, ref, type Ref } from "vue";

describe("useDisabled", () => {
  let disabledSpy: Ref<boolean>;
  
  const createTestComp = (defaultValue: boolean, provideContext: boolean = true, mockDisabled?: Ref<boolean>) => {
    const mockFormProvide: FormContext = {
      disabled: mockDisabled,
      rules: ref({}),
      validateErrors: ref({}),
      validateFieldErrors: ref({}),
      validateField: vi.fn(),
      addFormItemContext: vi.fn(),
      removeFormItemContext: vi.fn(),
    };

    return mount(
      defineComponent({
        setup() {
          const { disabled } = useDisabled(defaultValue);
          disabledSpy = disabled;
          return {
            disabled,
          };
        },
        render() {
          return "<div/>";
        },
      }),
      {
        global: {
          provide: provideContext ? {
            [FORM_CONTEXT_KEY]: mockFormProvide,
          } : {},
        },
      }
    );
  };

  test("default value when no context", async () => {
    createTestComp(true, false);
    await nextTick();
    expect(disabledSpy.value).toBe(true);
  });

  test("default value when context exists but disabled is undefined", async () => {
    createTestComp(true, true, undefined);
    await nextTick();
    expect(disabledSpy.value).toBe(true);
  });

  test("context disabled controls the value completely", async () => {
    // 设置context的disabled值
    createTestComp(false, true, ref(true));
    await nextTick();
    expect(disabledSpy.value).toBe(true);
    
    // 尝试修改值，应该被context阻止
    disabledSpy.value = false;
    await nextTick();
    expect(disabledSpy.value).toBe(true);
  });

  test("context disabled can be changed", async () => {
    // 设置context的disabled值
    const contextDisabled = ref(false);
    createTestComp(true, true, contextDisabled);
    await nextTick();
    expect(disabledSpy.value).toBe(false);
    
    // 修改context的值
    contextDisabled.value = true;
    await nextTick();
    expect(disabledSpy.value).toBe(true);
  });

  test("local disabled works when no context", async () => {
    createTestComp(false, false);
    await nextTick();
    expect(disabledSpy.value).toBe(false);
    
    // 可以修改本地值
    disabledSpy.value = true;
    await nextTick();
    expect(disabledSpy.value).toBe(true);
  });

  test("local disabled works when context exists but disabled is undefined", async () => {
    createTestComp(false, true, undefined);
    await nextTick();
    expect(disabledSpy.value).toBe(false);
    
    // 可以修改本地值
    disabledSpy.value = true;
    await nextTick();
    expect(disabledSpy.value).toBe(true);
  });

  test("context disabled takes precedence over local value", async () => {
    // 设置context的disabled值
    createTestComp(false, true, ref(true));
    await nextTick();
    expect(disabledSpy.value).toBe(true);
    
    // 即使尝试修改本地值，context仍然控制
    disabledSpy.value = false;
    await nextTick();
    expect(disabledSpy.value).toBe(true);
  });
});
