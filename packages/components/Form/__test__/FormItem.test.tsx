import { describe, it, expect, beforeEach, test, vi } from "vitest";
import HFormItem from "../FormItem.vue";
import { mount } from "@vue/test-utils";
import type { FormItemContext, FormItemProps, FormRules } from "../type";
import { FORM_CONTEXT_KEY, FORM_ITEM_CONTEXT_KEY } from "../constants";
import { defineComponent, inject, nextTick, ref } from "vue";
import type { ValidateFieldsError } from "async-validator";

const mockValidateFieldErrors = ref<ValidateFieldsError>();
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
            validateFieldErrors: mockValidateFieldErrors,
            rules: mockRules,
            validateField: mockValidateField,
            validate: mockValidate,
            addFormItemContext: vi.fn(),
            removeFormItemContext: vi.fn(),
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
      mockValidateFieldErrors.value = undefined;
    });
    it("should render error message", async () => {
      const wrapper = createTestComp({
        label: "test",
        prop: "test",
      });
      mockValidateFieldErrors.value = {
        test: [
          {
            message: "error message",
          },
          {
            message: "error message 2",
          },
        ],
      };
      await nextTick();
      expect(wrapper.find(".h-form-item-message").isVisible()).toBe(true);
      expect(wrapper.find(".h-form-item-message").text()).toBe("error message");
    });
    it("should not render error message when showMessage is false", async () => {
      const wrapper = createTestComp({
        label: "test",
        prop: "test",
        showMessage: false,
      });
      mockValidateFieldErrors.value = {
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
      mockValidateFieldErrors.value = {
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
      mockRules.value = {};
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
    it("可以同时有多种触发校验时机", async () => {
      createTestComp({
        label: "test",
        prop: "test",
        rules: { required: true, message: "test message", trigger: ["blur", "change"] },
      });
      expect(mockValidateField).toHaveBeenCalledTimes(0);
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

  describe("标签位置布局", () => {
    it.each([
      "left",
      "right",
      "top",
      "bottom",
    ] as FormItemProps["labelPosition"][])(
      "默认应该应用label-%s类",
      (labelPosition) => {
        const wrapper = createTestComp({
          label: "test",
          labelPosition,
        });
        expect(wrapper.classes()).toContain(
          `h-form-item--label-${labelPosition}`
        );
      }
    );

    it("应该渲染content-inner包装器", () => {
      const wrapper = createTestComp({
        label: "test",
      });
      expect(wrapper.find(".h-form-item-content-inner").exists()).toBe(true);
    });
  });

  describe("标签宽度控制", () => {
    it.each([
      "auto",
      "150px",
    ] as FormItemProps["labelWidth"][])(
      "labelWidth为%s时应该设置width为%s",
      (labelWidth) => {
      const wrapper = createTestComp({
        label: "test",
        labelWidth,
      });
      const label = wrapper.find(".h-form-item-label");
      console.log(label.attributes("style"));
      expect(label.attributes("style")).toContain(`width: ${labelWidth}`);
    });
    it("labelWidth为数字时应该转换为像素", () => {
      const wrapper = createTestComp({
        label: "test",
        labelWidth: 150,
      });
      const label = wrapper.find(".h-form-item-label");
      console.log(label.attributes("style"));
      expect(label.attributes("style")).toContain("width: 150px");
    });
    it("未设置labelWidth时不应该设置width样式", () => {
      const wrapper = createTestComp({
        label: "test",
      });
      const label = wrapper.find(".h-form-item-label");
      console.log(label.attributes("style"));
      expect(label.attributes("style")).toBeUndefined();
    });
  });
});
