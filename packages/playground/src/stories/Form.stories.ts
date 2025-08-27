import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { HForm, HFormItem, HInput, ErButton, ErButtonGroup, HMessage } from "hyl-fake-element-plus";
import { ref, reactive } from "vue";
import "hyl-fake-element-plus/dist/es/styles/index.css";
import "hyl-fake-element-plus/dist/es/styles/Form.css";
import "hyl-fake-element-plus/dist/es/styles/Input.css";
import "hyl-fake-element-plus/dist/es/styles/Button.css";

const meta: Meta<typeof HForm> = {
  title: "Components/Form",
  component: HForm,
  parameters: {
    docs: {
      description: {
        component: "Form表单组件，支持表单验证、数据绑定等功能",
      },
    },
  },
  argTypes: {
    // Form组件的props
    model: {
      description: "表单数据对象",
      control: { type: "object" },
    },
    rules: {
      description: "表单验证规则",
      control: { type: "object" },
    },
    validateOnRuleChange: {
      control: "boolean",
      description: "是否在规则改变时立即验证",
    },
    labelWidth: {
      control: { type: "select" },
      options: ["auto", "100px", "120px", "150px", "200px"],
      description: "表单标签宽度",
    },
    // FormItem组件的props
    itemLabel: {
      control: "text",
      description: "表单项标签文本",
    },
    itemLabelWidth: {
      control: { type: "select" },
      options: ["auto", "80px", "100px", "120px", "150px"],
      description: "表单项标签宽度",
    },
    itemProp: {
      control: "text",
      description: "表单项字段名",
    },
    itemShowMessage: {
      control: "boolean",
      description: "是否显示验证消息",
    },
    itemLabelPosition: {
      control: { type: "select" },
      options: ["left", "right", "top", "bottom"],
      description: "标签位置",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 表单验证示例
export const Validation: Story = {
  render: (args) => ({
    components: { HForm, HFormItem, HInput, ErButton },
    setup() {
      const formRef = ref();
      const formData = reactive({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      const rules = {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 20,
            message: "用户名长度在 3 到 20 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, message: "密码长度不能少于 6 个字符", trigger: "blur" },
        ],
        confirmPassword: [
          { required: true, message: "请再次输入密码", trigger: "blur" },
          {
            validator: (rule: any, value: string, callback: Function) => {
              if (value !== formData.password) {
                callback(new Error("两次输入密码不一致"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
      };

      const handleSubmit = async () => {
        formRef.value?.validate((valid: boolean, errors: any) => {
          if (valid) {
            console.log("验证通过，表单提交:", formData);
          } else {
            console.log("验证失败:", errors);
          }
        });
      };

      const handleReset = () => {
        formRef.value?.clearValidate();
        Object.keys(formData).forEach((key) => {
          formData[key] = "";
        });
      };

      return { formRef, formData, rules, handleSubmit, handleReset, args };
    },
    template: `
      <div style="max-width: 500px;">
        <HForm 
          ref="formRef"
          :model="formData"
          :rules="rules"
          v-bind="args"
        >
          <HFormItem 
            :label="args.itemLabel || '用户名'" 
            :prop="args.itemProp || 'username'" 
            :label-width="args.itemLabelWidth || '100px'"
            :show-message="args.itemShowMessage !== false"
            :label-position="args.itemLabelPosition || 'left'"
          >
            <HInput 
              v-model="formData.username" 
              placeholder="请输入用户名"
              clearable
            />
          </HFormItem>
          
          <HFormItem label="邮箱" prop="email" label-width="100px">
            <HInput 
              v-model="formData.email" 
              type="email"
              placeholder="请输入邮箱"
              clearable
            />
          </HFormItem>
          
          <HFormItem label="密码" prop="password" label-width="100px">
            <HInput 
              v-model="formData.password" 
              type="password"
              placeholder="请输入密码"
              show-password
            />
          </HFormItem>
          
          <HFormItem label="确认密码" prop="confirmPassword" label-width="100px">
            <HInput 
              v-model="formData.confirmPassword" 
              type="password"
              placeholder="请再次输入密码"
              show-password
            />
          </HFormItem>
          
          <HFormItem label-width="100px">
            <ErButton type="primary" @click="handleSubmit">提交</ErButton>
            <ErButton style="margin-left: 10px;" @click="handleReset">重置</ErButton>
          </HFormItem>
        </HForm>
        
        <div style="margin-top: 20px; background: #f5f5f5; padding: 16px; border-radius: 4px;">
          <h4 style="margin-top: 0;">表单数据:</h4>
          <pre style="margin: 0; white-space: pre-wrap;">{{ JSON.stringify(formData, null, 2) }}</pre>
        </div>
      </div>
    `,
  }),
  args: {
    validateOnRuleChange: true,
    labelWidth: "auto",
    itemLabel: "用户名",
    itemLabelWidth: "100px",
    itemProp: "username",
    itemShowMessage: true,
    itemLabelPosition: "left",
  },
};

// 实时验证示例
export const RealTimeValidation: Story = {
  render: (args) => ({
    components: { HForm, HFormItem, HInput, ErButton },
    setup() {
      const formRef = ref();
      const formData = reactive({
        username: "",
        email: "",
        phone: "",
      });

      const rules = {
        username: [
          { required: true, message: "请输入用户名", trigger: "change" },
          {
            min: 3,
            max: 20,
            message: "用户名长度在 3 到 20 个字符",
            trigger: "change",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "change" },
          { type: "email", message: "请输入正确的邮箱地址", trigger: "change" },
        ],
        phone: [
          { required: true, message: "请输入手机号", trigger: "change" },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "请输入正确的手机号",
            trigger: "change",
          },
        ],
      };

      const handleSubmit = async () => {
        await formRef.value?.validate((valid: boolean, errors: any) => {
          if (valid) {
            console.log("验证通过，表单提交:", formData);
          } else {
            console.log("验证失败:", errors);
          }
        });
      };

      return { formRef, formData, rules, handleSubmit, args };
    },
    template: `
      <div style="max-width: 500px;">
        <HForm 
          ref="formRef"
          :model="formData"
          :rules="rules"
          v-bind="args"
        >
          <HFormItem label="用户名" prop="username" label-width="100px">
            <HInput 
              v-model="formData.username" 
              placeholder="请输入用户名"
              clearable
            />
          </HFormItem>
          
          <HFormItem label="邮箱" prop="email" label-width="100px">
            <HInput 
              v-model="formData.email" 
              type="email"
              placeholder="请输入邮箱"
              clearable
            />
          </HFormItem>
          
          <HFormItem label="手机号" prop="phone" label-width="100px">
            <HInput 
              v-model="formData.phone" 
              type="tel"
              placeholder="请输入手机号"
              clearable
            />
          </HFormItem>
          
          <HFormItem label-width="100px">
            <ErButton type="primary" @click="handleSubmit">提交</ErButton>
          </HFormItem>
        </HForm>
        
        <div style="margin-top: 20px; background: #f5f5f5; padding: 16px; border-radius: 4px;">
          <h4 style="margin-top: 0;">表单数据:</h4>
          <pre style="margin: 0; white-space: pre-wrap;">{{ JSON.stringify(formData, null, 2) }}</pre>
        </div>
      </div>
    `,
  }),
  args: {
    validateOnRuleChange: true,
    labelWidth: "auto",
    itemLabel: "用户名",
    itemLabelWidth: "100px",
    itemProp: "username",
    itemShowMessage: true,
    itemLabelPosition: "left",
  },
};


// 标签位置布局展示
export const LabelPositions: Story = {
  render: (args) => ({
    components: { HForm, HFormItem, HInput, ErButton, ErButtonGroup,HMessage },
    setup() {
      const positions = ["left", "right", "top", "bottom"];
      const position = ref("");
      const formData = reactive({
        username: "",
        email: "",
        description: "",
        notes: "",
      });
      return { formData, args, positions, position };
    },
    template: `
      <div style="max-width: 800px;">
        <h3 style="margin-bottom: 20px; color: #409eff;">FormItem 标签位置布局展示</h3>
        <ErButtonGroup>
          <ErButton v-for="p in positions" :key="p" :type="position === p ? 'info' : 'primary'" @click="position = p">
            {{ p }}
          </ErButton>
        </ErButtonGroup>
        <!-- 自动宽度展示 -->
        <div style="margin-top: 40px;">
          <h4 style="margin-bottom: 15px; color: #409eff;">自动宽度展示 (label-width="auto")</h4>
          <HForm :model="formData" v-bind="args" label-width="auto">
            <HFormItem label="短标签" label-width="auto" :label-position="position">
              <HInput 
                v-model="formData.username" 
                placeholder="请输入用户名"
                clearable
              />
            </HFormItem>
            
            <HFormItem label="这是一个很长的标签文本" label-width="auto" :label-position="position">
              <HInput 
                v-model="formData.email" 
                type="email"
                placeholder="请输入邮箱"
                clearable
              />
            </HFormItem>
            
            <HFormItem label="中等长度标签" label-width="auto" :label-position="position">
              <HInput 
                v-model="formData.description" 
                placeholder="请输入描述信息"
                clearable
              />
            </HFormItem>
            
            <HFormItem label="超长标签文本用于测试自动宽度功能" label-width="auto" :label-position="position">
              <HInput 
                v-model="formData.notes" 
                placeholder="请输入备注信息"
                clearable
              />
            </HFormItem>
          </HForm>
        </div>

        <!-- 对比展示：固定宽度 vs 自动宽度 -->
        <div style="margin-top: 40px;">
          <h4 style="margin-bottom: 15px; color: #409eff;">对比展示：固定宽度 vs 自动宽度</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
            <div>
              <h5 style="margin-bottom: 10px; color: #67c23a;">固定宽度 (label-width="120px")</h5>
              <HForm :model="formData" v-bind="args">
                <HFormItem label="用户名" label-width="120px">
                  <HInput placeholder="固定宽度标签" />
                </HFormItem>
                <HFormItem label="邮箱地址" label-width="120px">
                  <HInput placeholder="固定宽度标签" />
                </HFormItem>
                <HFormItem label="手机号码" label-width="120px">
                  <HInput placeholder="固定宽度标签" />
                </HFormItem>
              </HForm>
            </div>
            
            <div>
              <h5 style="margin-bottom: 10px; color: #e6a23c;">自动宽度 (label-width="auto" 最后一项为固定宽度)</h5>
              <HForm :model="formData" v-bind="args">
                <HFormItem label="用户名" label-width="auto">
                  <HInput placeholder="自动宽度标签" />
                </HFormItem>
                <HFormItem label="邮箱地址" label-width="auto">
                  <HInput placeholder="自动宽度标签" />
                </HFormItem>
                <HFormItem label="将会依据这个最长的宽度来自动布局">
                  <HInput placeholder="自动宽度标签" />
                </HFormItem>
              </HForm>
            </div>
          </div>
        </div>

        <div style="margin-top: 20px; background: #f5f5f5; padding: 16px; border-radius: 4px;">
          <h4 style="margin-top: 0;">表单数据:</h4>
          <pre style="margin: 0; white-space: pre-wrap;">{{ JSON.stringify(formData, null, 2) }}</pre>
        </div>
      </div>
    `,
  }),
  args: {
    labelWidth: "auto",
    itemLabel: "用户名",
    itemLabelWidth: "100px",
    itemProp: "username",
    itemShowMessage: true,
    itemLabelPosition: "left",
  },
};

// 新增：Props Controls 演示
export const PropsControls: Story = {
  render: (args) => ({
    components: { HForm, HFormItem, HInput, ErButton },
    setup() {
      const formRef = ref();
      const formData = reactive({
        username: "",
        email: "",
        description: "",
      });

      const rules = {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 20, message: "用户名长度在 3 到 20 个字符", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" },
        ],
        description: [
          { required: true, message: "请输入描述信息", trigger: "blur" },
        ],
      };

      const handleSubmit = async () => {
        formRef.value?.validate((valid: boolean, errors: any) => {
          if (valid) {
            console.log("验证通过，表单提交:", formData);
          } else {
            console.log("验证失败:", errors);
          }
        });
      };

      return { formRef, formData, rules, handleSubmit, args };
    },
    template: `
      <div style="max-width: 600px;">
        <h3 style="margin-bottom: 20px; color: #409eff;">Props Controls 演示</h3>
        <p style="margin-bottom: 20px; color: #666;">
          使用右侧的 Controls 面板来调整以下属性：
        </p>
        
        <HForm 
          ref="formRef"
          :model="formData"
          :rules="rules"
          :validate-on-rule-change="args.validateOnRuleChange"
          :label-width="args.labelWidth"
        >
          <HFormItem 
            :label="args.itemLabel || '用户名'" 
            :prop="args.itemProp || 'username'" 
            :label-width="args.itemLabelWidth || '100px'"
            :show-message="args.itemShowMessage !== false"
            :label-position="args.itemLabelPosition || 'left'"
          >
            <HInput 
              v-model="formData.username" 
              placeholder="请输入用户名"
              clearable
            />
          </HFormItem>
          
          <HFormItem 
            label="邮箱" 
            prop="email" 
            :label-width="args.itemLabelWidth || '100px'"
            :show-message="args.itemShowMessage !== false"
            :label-position="args.itemLabelPosition || 'left'"
          >
            <HInput 
              v-model="formData.email" 
              type="email"
              placeholder="请输入邮箱"
              clearable
            />
          </HFormItem>
          
          <HFormItem 
            label="描述" 
            prop="description" 
            :label-width="args.itemLabelWidth || '100px'"
            :show-message="args.itemShowMessage !== false"
            :label-position="args.itemLabelPosition || 'left'"
          >
            <HInput 
              v-model="formData.description" 
              placeholder="请输入描述信息"
              clearable
            />
          </HFormItem>
          
          <HFormItem :label-width="args.itemLabelWidth || '100px'">
            <ErButton type="primary" @click="handleSubmit">提交</ErButton>
          </HFormItem>
        </HForm>
        
        <div style="margin-top: 20px; background: #f5f5f5; padding: 16px; border-radius: 4px;">
          <h4 style="margin-top: 0;">当前 Props 配置:</h4>
          <pre style="margin: 0; white-space: pre-wrap;">{{ JSON.stringify(args, null, 2) }}</pre>
        </div>
        
        <div style="margin-top: 20px; background: #f5f5f5; padding: 16px; border-radius: 4px;">
          <h4 style="margin-top: 0;">表单数据:</h4>
          <pre style="margin: 0; white-space: pre-wrap;">{{ JSON.stringify(formData, null, 2) }}</pre>
        </div>
      </div>
    `,
  }),
  args: {
    validateOnRuleChange: true,
    labelWidth: "auto",
    itemLabel: "用户名",
    itemLabelWidth: "100px",
    itemProp: "username",
    itemShowMessage: true,
    itemLabelPosition: "left",
  },
};
