import { describe, it, expect, vi, test, beforeEach } from "vitest";
import HForm from "../Form.vue";
import { mount } from "@vue/test-utils";
import { defineComponent, nextTick, reactive } from "vue";
import HFormItem from "../FormItem.vue";
import type {
  FormItemProps,
  FormItemRule,
  FormProps,
  FormRules,
} from "../type";

describe("Form", () => {
  const createFormItem = (formItemProps: FormItemProps) => {
    return defineComponent({
      setup() {
        return () => <HFormItem {...formItemProps} />;
      },
    });
  };
  const createTestComp = (
    props: FormProps = {},
    formItemProps: FormItemProps[] = []
  ) => {
    return mount(HForm, {
      props,
      slots: {
        default: formItemProps.map((item) => createFormItem(item)),
      },
      attachTo: document.body,
    });
  };
  describe("expose", () => {
    it("validateField", async () => {
      const cb = vi.fn();
      const model: Record<string, any> = {
        name: 20,
        age: "18",
      };
      const wrapper = createTestComp(
        {
          model,
          rules: {
            name: [
              {
                type: "string",
                message: "name is required and must be a string",
              },
            ],
            age: [
              {
                type: "number",
                message: "age is required and must be a number",
              },
            ],
          },
        },
        [
          {
            prop: "age",
          },
        ]
      );
      await wrapper.vm.validateField("age", cb);
      await nextTick();
      expect(wrapper.text()).toContain("age is required and must be a number");
      expect(wrapper.text()).not.toContain("name is required and must be a string");
      expect(cb).toHaveBeenCalledTimes(1);

      model.age = 18;
      await wrapper.vm.validateField("age", cb);
      await nextTick();
      expect(cb).toHaveBeenCalledTimes(2);
    });
    it("validate", async () => {
      const cb = vi.fn();
      const model: Record<string, any> = {
        name: 20,
        age: "18",
        phone: "12345678901",
      };
      const wrapper = createTestComp(
        {
          model,
          rules: {
            name: [
              {
                type: "string",
                message: "name is required and must be a string",
              },
            ],
            age: [
              {
                type: "number",
                message: "age is required and must be a number",
              },
            ],
            phone: [
              {
                type: "string",
                message: "phone is required and must be a string",
              },
            ],
          } as FormRules,
        },
        [
          {
            prop: "name",
          },
          {
            prop: "age",
          },
        ]
      );
      await nextTick();
      await wrapper.vm.validate(cb);
      expect(cb).toHaveBeenCalledTimes(1);
      expect(wrapper.text()).toContain("name is required and must be a string");
      expect(wrapper.text()).toContain("age is required and must be a number");

      model.age = 18;
      model.name = "test";
      await wrapper.vm.validate(cb);
      expect(cb).toHaveBeenCalledTimes(2);
    });
    it("clearValidate", async () => {
      const wrapper = createTestComp(
        {
          model: {
            name: 20,
            age: "18",
            phone: 100,
          },
          rules: {
            name: [{ type: "string", message: "name must be a string" }],
            age: [{ type: "number", message: "age must be a number" }],
            phone: [{ type: "string", message: "phone must be a string" }],
          },
        },
        [{ prop: "name" }, { prop: "age" }, { prop: "phone" }]
      );
      await wrapper.vm.validate();
      console.log(wrapper.text());
      expect(wrapper.text()).toContain("name must be a string");
      expect(wrapper.text()).toContain("age must be a number");
      expect(wrapper.text()).toContain("phone must be a string");
      wrapper.vm.clearValidate(["name", "age"]);
      await nextTick();
      expect(wrapper.text()).not.toContain("name must be a string");
      expect(wrapper.text()).not.toContain("age must be a number");
      expect(wrapper.text()).toContain("phone must be a string");
      wrapper.vm.clearValidate("phone");
      await nextTick();
      expect(wrapper.text()).not.toContain("phone must be a string");
      wrapper.vm.clearValidate();
      await nextTick();
      expect(wrapper.text()).not.toContain("name must be a string");
      expect(wrapper.text()).not.toContain("age must be a number");
      expect(wrapper.text()).not.toContain("phone must be a string");
    });
  });
  describe("与 FormItem 的交互", () => {
    it("rules 应当会被 FormItem 的 rules 合并", async () => {
      const wrapper = createTestComp(
        {
          model: {
            name: 20,
            age: 18,
          },
          rules: {
            name: [
              { required: true, message: "name is required" },
            ] as FormItemRule,
            age: [
              {
                type: "number",
                message: "age is required",
              },
            ] as FormItemRule,
          },
        },
        [
          {
            prop: "name",
            rules: [
              {
                type: "string",
                message: "name is required and must be a string",
              },
            ],
          },
          {
            prop: "age",
            rules: [
              {
                type: "number",
                message: "age is required and must be a number",
              },
            ],
          },
        ]
      );
      await nextTick();
      await wrapper.vm.validateField("name");
      await nextTick();
      expect(wrapper.text()).toContain("name is required and must be a string");
    });
  });
  describe("组合测试", () => {
    test("表单校验信息", async () => {
      const model = reactive({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      const wrapper = createTestComp(
        {
          model,
          rules: {
            name: [{ required: true, message: "name is required" }],
            email: [
              { required: true, message: "email is required" },
              { type: "email", message: "email is invalid" },
            ],
            password: [
              { required: true, message: "password is required" },
              { min: 8, message: "password is too short" },
            ],
            confirmPassword: [
              { required: true, message: "confirmPassword is required" },
              {
                required: true,
                message: "confirmPassword is not equal to password",
                validator: (rule, value, callback) => {
                  if (value !== model.password) {
                    callback("confirmPassword is not equal to password");
                  } else {
                    callback();
                  }
                },
              },
            ],
          },
        },
        [
          {
            prop: "name",
          },
          {
            prop: "email",
          },
          {
            prop: "password",
          },
          {
            prop: "confirmPassword",
          },
        ]
      );
      await nextTick();
      await wrapper.vm.validate();

      // initial state
      expect(wrapper.text()).toContain("name is required");
      expect(wrapper.text()).toContain("email is required");
      expect(wrapper.text()).toContain("password is required");
      expect(wrapper.text()).toContain("confirmPassword is required");

      // password 校验
      model.password = "123456";
      await wrapper.vm.validateField("password");
      expect(wrapper.text()).toContain("password is too short");
      model.password = "123456789";
      await wrapper.vm.validateField("password");
      expect(wrapper.text()).not.toContain("password is too short");

      model.confirmPassword = "1234567";
      await wrapper.vm.validateField("confirmPassword");
      expect(wrapper.text()).toContain(
        "confirmPassword is not equal to password"
      );
      model.confirmPassword = "123456789";
      await wrapper.vm.validateField("confirmPassword");
      expect(wrapper.text()).not.toContain(
        "confirmPassword is not equal to password"
      );

      // email 校验
      model.email = "test@test";
      await wrapper.vm.validateField("email");
      expect(wrapper.text()).toContain("email is invalid");
      model.email = "test@test.com";
      await wrapper.vm.validateField("email");
      expect(wrapper.text()).not.toContain("email is invalid");

      // name 校验
      model.name = "";
      await wrapper.vm.validateField("name");
      expect(wrapper.text()).toContain("name is required");
      model.name = "test";
      await wrapper.vm.validateField("name");
      expect(wrapper.text()).not.toContain("name is required");

      // 验证通过
      await wrapper.vm.validate();
      const messges = wrapper.findAll(".h-form-item-message")
      messges.forEach((item,index) => {
        console.log(index,item.text());
        expect(item.isVisible()).toBe(false);
      });
    });
  });
  describe("validate事件", () => {
    const onValidate = vi.fn();
    beforeEach(() => {
      onValidate.mockClear();
    });
    it("单个字段验证时应该触发validate事件", async () => {
      const model: Record<string, any> = {
        name: 20,
        age: "18",
      };
      const wrapper = createTestComp(
        {
          model,
          rules: {
            name: [
              {
                type: "string",
                message: "name is required and must be a string",
              },
            ],
            age: [
              {
                type: "number",
                message: "age is required and must be a number",
              },
            ],
          },
          validateOnRuleChange: false,
        },
        [
          {
            prop: "age",
          },
        ]
      );
      
      // 等待组件完全挂载和初始化
      await nextTick();
      
      // 第一次验证：验证失败
      await wrapper.vm.validateField("age");
      
      expect(wrapper.emitted("validate")).toBeDefined();
      expect(wrapper.emitted("validate")?.length).toBe(1)
    });

    it("整个表单验证时应该触发validate事件", async () => {
      const model: Record<string, any> = {
        name: 20,
        age: "18",
      };
      const wrapper = createTestComp(
        {
          model,
          rules: {
            name: [
              {
                type: "string",
                message: "name is required and must be a string",
              },
            ],
            age: [
              {
                type: "number",
                message: "age is required and must be a number",
              },
            ],
          },
          validateOnRuleChange: false,
        },
        [
          {
            prop: "name",
          },
          {
            prop: "age",
          },
        ]
      );
      
      // 等待组件完全挂载和初始化
      await nextTick();

      // 第一次验证：验证失败
      await wrapper.vm.validate();
      await nextTick();
      
      expect(wrapper.emitted("validate")).toBeDefined();
      expect(wrapper.emitted("validate")?.length).toBe(1)
    });
  });
});
