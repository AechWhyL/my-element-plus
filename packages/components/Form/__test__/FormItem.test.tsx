import { describe, it, expect, beforeEach, test, vi } from "vitest";
import HFormItem from "../FormItem.vue";
import { mount } from "@vue/test-utils";
import type { FormItemContext, FormItemProps, FormRules } from "../type";
import { FORM_CONTEXT_KEY, FORM_ITEM_CONTEXT_KEY } from "../constants";
import { defineComponent, inject, nextTick, ref } from "vue";
import type { ValidateFieldsError } from "async-validator";

const mockValidateErrors = ref<ValidateFieldsError>();
const mockRules = ref<FormRules>({});
const mockValidate = vi.fn();
const mockValidateField = vi.fn();

let formItemContext: FormItemContext | undefined;

describe("FormItem", () => {
  const createTestComp = (props: FormItemProps) => {
    return mount(HFormItem, {
      props,
      global: {
        provide: {
          [FORM_CONTEXT_KEY]: {
            validateErrors: mockValidateErrors,
            rules: mockRules,
            validateField: mockValidateField,
            validate: mockValidate,
          },
        },
      },
      slots: {
        default: defineComponent({
          setup() {
            formItemContext = inject(FORM_ITEM_CONTEXT_KEY);
          },
          render() {
            return "<div/>";
          },
        }),
      },
    });
  };
  it("should render", () => {
    const wrapper = createTestComp({
      label: "test",
    });
    expect(wrapper.find("label").text()).toBe("test");
  });
  describe("错误信息", () => {
    beforeEach(() => {
      mockValidateErrors.value = undefined;
    });
    it("should render error message", async () => {
      const wrapper = createTestComp({
        label: "test",
        prop: "test",
      });
      mockValidateErrors.value = {
        test: [
          {
            message: "error message",
          },
        ],
      };
      await nextTick();
      expect(wrapper.find(".h-form-item-message").isVisible()).toBe(true);
    });
    it("should not render error message when showMessage is false", async () => {
      const wrapper = createTestComp({
        label: "test",
        prop: "test",
        showMessage: false,
      });
      mockValidateErrors.value = {
        test: [
          {
            message: "error message",
          },
        ],
      };
      await nextTick();
      expect(wrapper.find(".h-form-item-message").isVisible()).toBe(false);
    });
    it("必须设置prop属性来获取错误信息", async () => {
      const wrapper = createTestComp({
        label: "test",
      });
      mockValidateErrors.value = {
        name: [
          {
            message: "please input name",
          },
        ],
      };
      await nextTick();
      expect(wrapper.find(".h-form-item-message").text()).not.toBe(
        "please input name"
      );
    });
  });
  describe("表单控件通信", () => {
    beforeEach(() => {
      formItemContext = undefined;
      mockValidateField.mockClear();
      mockValidate.mockClear();
    });
    test("子组件触发校验", async () => {
      createTestComp({
        label: "test",
        prop: "test",
        rules: [
          { required: true, message: "test blur message", trigger: "blur" },
          { message: "test change message", trigger: "change" },
        ],
      });
      formItemContext?.onValidateTrigger("blur");
      expect(mockValidateField).toHaveBeenCalledTimes(1);
      formItemContext?.onValidateTrigger("change");
      expect(mockValidateField).toHaveBeenCalledTimes(2);
    });
    it("必须设置prop属性来触发校验", async () => {
      createTestComp({
        label: "test",
        rules: [{ required: true, message: "test message", trigger: "blur" }],
      });
      formItemContext?.onValidateTrigger("blur");
      expect(mockValidateField).not.toHaveBeenCalled();
    });
  });
});
