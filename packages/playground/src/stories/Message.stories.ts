import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { within, userEvent } from "storybook/test";
import { defineComponent } from "vue";

import { HMessage } from "hyl-fake-element-plus";
import "hyl-fake-element-plus/dist/es/styles/index.css";
import "hyl-fake-element-plus/dist/es/styles/Message.css";

// 创建一个演示组件来展示Message功能
const MessageDemo = defineComponent({
  name: "MessageDemo",
  props: {
    type: {
      type: String,
      default: "info",
      validator: (value: string) => ["success", "info", "warning", "error"].includes(value)
    },
    message: {
      type: String,
      default: "这是一条消息"
    },
    duration: {
      type: Number,
      default: 3000
    },
    effect: {
      type: String,
      default: "light",
      validator: (value: string) => ["dark", "light"].includes(value)
    },
    icon: {
      type: String,
      default: ""
    },
    customClass: {
      type: String,
      default: ""
    }
  },
  setup(props) {
    const showMessage = () => {
      HMessage({
        type: props.type,
        message: props.message,
        duration: props.duration,
        effect: props.effect,
        icon: props.icon,
        customClass: props.customClass
      });
    };

    return { showMessage };
  },
  template: `
    <div style="padding: 20px;">
      <button 
        @click="showMessage" 
        :style="{
          padding: '8px 16px', 
          background: getButtonColor(type), 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px', 
          cursor: 'pointer'
        }"
      >
        显示{{ getTypeText(type) }}消息
      </button>
      <p style="margin-top: 20px; color: #666;">
        消息内容: {{ message }}
      </p>
    </div>
  `,
  methods: {
    getButtonColor(type: string) {
      const colors = {
        success: '#67c23a',
        info: '#409eff',
        warning: '#e6a23c',
        error: '#f56c6c'
      };
      return colors[type as keyof typeof colors] || '#409eff';
    },
    getTypeText(type: string) {
      const texts = {
        success: '成功',
        info: '信息',
        warning: '警告',
        error: '错误'
      };
      return texts[type as keyof typeof texts] || '信息';
    }
  }
});

type Story = StoryObj<typeof MessageDemo>;

const meta: Meta<typeof MessageDemo> = {
  title: "Example/Message",
  component: MessageDemo,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: { type: "select" },
      options: ["success", "info", "warning", "error"],
    },
    message: {
      control: { type: "text" },
    },
    duration: {
      control: { type: "number" },
    },
    effect: {
      control: { type: "select" },
      options: ["dark", "light"],
    },
    icon: {
      control: { type: "text" },
    },
    customClass: {
      control: { type: "text" },
    },
  },
  args: {
    type: "info",
    message: "这是一条消息",
    duration: 3000,
    effect: "light",
    icon: "",
    customClass: "",
  },
};

// 基础消息展示
export const Default: Story = {
  args: {
    type: "info",
    message: "这是一条基础消息",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("点击按钮显示消息", async () => {
      await userEvent.click(canvas.getByText("显示信息消息"));
    });
  },
};

// 成功消息
export const Success: Story = {
  args: {
    type: "success",
    message: "操作成功！",
    duration: 5000,
  },
};

// 警告消息
export const Warning: Story = {
  args: {
    type: "warning",
    message: "警告：请注意操作！",
    duration: 4000,
  },
};

// 错误消息
export const Error: Story = {
  args: {
    type: "error",
    message: "错误：操作失败！",
    duration: 6000,
  },
};

// 自定义图标消息
export const CustomIcon: Story = {
  args: {
    type: "info",
    message: "自定义图标消息",
    icon: "star",
    duration: 3000,
  },
};

// 多种消息类型展示
export const MultipleTypes: Story = {
  render: () => ({
    components: { MessageDemo },
    setup() {
      const showSuccess = () => HMessage({ type: "success", message: "成功消息" });
      const showInfo = () => HMessage({ type: "info", message: "信息消息" });
      const showWarning = () => HMessage({ type: "warning", message: "警告消息" });
      const showError = () => HMessage({ type: "error", message: "错误消息" });
      
      return { showSuccess, showInfo, showWarning, showError };
    },
    template: `
      <div style="padding: 20px;">
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button @click="showSuccess" style="padding: 8px 16px; background: #67c23a; color: white; border: none; border-radius: 4px; cursor: pointer;">
            成功
          </button>
          <button @click="showInfo" style="padding: 8px 16px; background: #409eff; color: white; border: none; border-radius: 4px; cursor: pointer;">
            信息
          </button>
          <button @click="showWarning" style="padding: 8px 16px; background: #e6a23c; color: white; border: none; border-radius: 4px; cursor: pointer;">
            警告
          </button>
          <button @click="showError" style="padding: 8px 16px; background: #f56c6c; color: white; border: none; border-radius: 4px; cursor: pointer;">
            错误
          </button>
        </div>
        <p style="margin-top: 20px; color: #666;">点击按钮显示不同类型的消息</p>
      </div>
    `,
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("依次点击所有按钮显示不同类型的消息", async () => {
      await userEvent.click(canvas.getByText("成功"));
      await userEvent.click(canvas.getByText("信息"));
      await userEvent.click(canvas.getByText("警告"));
      await userEvent.click(canvas.getByText("错误"));
    });
  },
};

// 消息分组测试
export const MessageGrouping: Story = {
  render: () => ({
    components: {},
    setup() {
      const showGroupedMessages = () => {
        // 快速连续显示多条消息，测试分组功能
        HMessage({ type: "info", message: "第一条消息", duration: 2000 });
        setTimeout(() => {
          HMessage({ type: "success", message: "第二条消息", duration: 2000 });
        }, 100);
        setTimeout(() => {
          HMessage({ type: "warning", message: "第三条消息", duration: 2000 });
        }, 200);
      };
      
      return { showGroupedMessages };
    },
    template: `
      <div style="padding: 20px;">
        <button @click="showGroupedMessages" style="padding: 8px 16px; background: #409eff; color: white; border: none; border-radius: 4px; cursor: pointer;">
          显示分组消息
        </button>
        <p style="margin-top: 20px; color: #666;">快速连续显示多条消息，测试消息分组和定位功能</p>
      </div>
    `,
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("点击按钮显示分组消息", async () => {
      await userEvent.click(canvas.getByText("显示分组消息"));
    });
  },
};

export default meta;
