import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { HInput } from 'hyl-fake-element-plus';
import { ref } from 'vue';
import 'hyl-fake-element-plus/dist/es/styles/index.css';
import 'hyl-fake-element-plus/dist/es/styles/Input.css';

const meta: Meta<typeof HInput> = {
  title: 'Components/Input',
  component: HInput,
  parameters: {
    docs: {
      description: {
        component: 'Input输入框组件，支持多种输入类型和状态'
      }
    }
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'textarea', 'password', 'email', 'url', 'tel', 'number', 'search', 'date', 'time', 'datetime-local', 'month', 'week', 'color', 'file', 'range', 'hidden'],
      description: '输入框类型'
    },
    size: {
      control: 'select',
      options: ['large', 'default', 'small'],
      description: '输入框尺寸'
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用'
    },
    readonly: {
      control: 'boolean',
      description: '是否只读'
    },
    clearable: {
      control: 'boolean',
      description: '是否可清空'
    },
    round: {
      control: 'boolean',
      description: '是否圆角'
    },
    showPassword: {
      control: 'boolean',
      description: '是否显示密码切换按钮'
    },
    placeholder: {
      control: 'text',
      description: '占位符文本'
    },
    maxlength: {
      control: 'number',
      description: '最大长度'
    },
    minlength: {
      control: 'number',
      description: '最小长度'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// 基础输入框 - 支持所有类型的实时切换
export const Basic: Story = {
  render: (args) => ({
    components: { HInput },
    setup() {
      const value = ref('');
      return { value, args };
    },
    template: `
      <div>
        <HInput 
          v-model="value" 
          v-bind="args"
        />
        <p style="margin-top: 10px; color: #666;">输入值: {{ value }}</p>
        <p style="margin-top: 5px; color: #999; font-size: 12px;">当前类型: {{ args.type }}, 尺寸: {{ args.size }}</p>
      </div>
    `
  }),
  args: {
    type: 'text',
    size: 'default',
    placeholder: '请输入内容',
    disabled: false,
    readonly: false,
    clearable: false,
    round: false,
    showPassword: false
  }
};

// 不同状态展示 - 支持实时切换
export const States: Story = {
  render: (args) => ({
    components: { HInput },
    setup() {
      const value = ref('示例内容');
      return { value, args };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div>
          <label style="display: block; margin-bottom: 8px; font-weight: bold;">正常状态</label>
          <HInput v-model="value" v-bind="args" />
        </div>
        
        <div>
          <label style="display: block; margin-bottom: 8px; font-weight: bold;">禁用状态</label>
          <HInput v-model="value" v-bind="args" disabled />
        </div>
        
        <div>
          <label style="display: block; margin-bottom: 8px; font-weight: bold;">只读状态</label>
          <HInput v-model="value" v-bind="args" readonly />
        </div>
        
        <div>
          <label style="display: block; margin-bottom: 8px; font-weight: bold;">圆角样式</label>
          <HInput v-model="value" v-bind="args" round />
        </div>
      </div>
    `
  }),
  args: {
    type: 'text',
    size: 'default',
    placeholder: '请输入内容',
    clearable: false,
    showPassword: false
  }
};

// 特殊类型展示 - 支持实时切换类型
export const SpecialTypes: Story = {
  render: (args) => ({
    components: { HInput },
    setup() {
      const value = ref('');
      return { value, args };
    },
    template: `
      <div>
        <HInput 
          v-model="value" 
          v-bind="args"
        />
        <p style="margin-top: 10px; color: #666;">输入值: {{ value }}</p>
        
        <!-- 特殊类型的额外展示 -->
        <div v-if="args.type === 'color'" style="margin-top: 10px;">
          <div style="width: 50px; height: 50px; background-color: v-bind(value || '#000000'); border: 1px solid #ddd;"></div>
        </div>
        
        <div v-if="args.type === 'range'" style="margin-top: 10px;">
          <p style="color: #999; font-size: 12px;">范围: 0 - 100</p>
        </div>
        
        <div v-if="args.type === 'textarea'" style="margin-top: 10px;">
          <p style="color: #999; font-size: 12px;">行数: {{ args.rows || 2 }}</p>
        </div>
      </div>
    `
  }),
  args: {
    type: 'text',
    size: 'default',
    placeholder: '请输入内容',
    rows: 2,
    min: 0,
    max: 100
  }
};

// 表单组合示例
export const FormExample: Story = {
  render: (args) => ({
    components: { HInput },
    setup() {
      const form = ref({
        username: '',
        email: '',
        password: '',
        bio: ''
      });
      return { form, args };
    },
    template: `
      <div style="max-width: 400px;">
        <h3 style="margin-bottom: 20px;">表单示例</h3>
        
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: bold;">用户名</label>
          <HInput 
            v-model="form.username" 
            placeholder="请输入用户名" 
            clearable
            v-bind="args"
          />
        </div>
        
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: bold;">邮箱</label>
          <HInput 
            v-model="form.email" 
            type="email" 
            placeholder="请输入邮箱" 
            v-bind="args"
          />
        </div>
        
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: bold;">密码</label>
          <HInput 
            v-model="form.password" 
            type="password" 
            placeholder="请输入密码" 
            show-password
            v-bind="args"
          />
        </div>
        
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: bold;">个人简介</label>
          <HInput 
            v-model="form.bio" 
            type="textarea" 
            placeholder="请输入个人简介" 
            :rows="3"
            v-bind="args"
          />
        </div>
        
        <div style="background: #f5f5f5; padding: 16px; border-radius: 4px;">
          <h4 style="margin-top: 0;">表单数据:</h4>
          <pre style="margin: 0; white-space: pre-wrap;">{{ JSON.stringify(form, null, 2) }}</pre>
        </div>
      </div>
    `
  }),
  args: {
    size: 'default',
    disabled: false,
    readonly: false,
    round: false
  }
};
