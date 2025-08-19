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
    },
    groupConfig: {
      type: Object,
      default: () => ({
        enabled: false,
        groupBy: undefined
      })
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
      // 基础分组消息 - 相同内容的消息会被分组
      const showBasicGrouping = () => {
        HMessage({ 
          type: "info", 
          message: "相同内容的消息会被分组", 
          duration: 4000,
          groupConfig: { enabled: true }
        });
        setTimeout(() => {
          HMessage({ 
            type: "info", 
            message: "相同内容的消息会被分组", 
            duration: 4000,
            groupConfig: { enabled: true }
          });
        }, 500);
        setTimeout(() => {
          HMessage({ 
            type: "info", 
            message: "相同内容的消息会被分组", 
            duration: 4000,
            groupConfig: { enabled: true }
          });
        }, 1000);
      };

      // 自定义分组依据 - 根据消息类型分组
      const showTypeGrouping = () => {
        HMessage({ 
          type: "success", 
          message: "成功消息1", 
          duration: 4000,
          groupConfig: { 
            enabled: true,
            groupBy: (instance) => instance.config.type
          }
        });
        setTimeout(() => {
          HMessage({ 
            type: "success", 
            message: "成功消息2", 
            duration: 4000,
            groupConfig: { 
              enabled: true,
              groupBy: (instance) => instance.config.type
            }
          });
        }, 300);
        setTimeout(() => {
          HMessage({ 
            type: "warning", 
            message: "警告消息1", 
            duration: 4000,
            groupConfig: { 
              enabled: true,
              groupBy: (instance) => instance.config.type
            }
          });
        }, 600);
        setTimeout(() => {
          HMessage({ 
            type: "warning", 
            message: "警告消息2", 
            duration: 4000,
            groupConfig: { 
              enabled: true,
              groupBy: (instance) => instance.config.type
            }
          });
        }, 900);
      };

      // 混合分组测试 - 启用和禁用分组
      const showMixedGrouping = () => {
        // 启用分组的消息
        HMessage({ 
          type: "info", 
          message: "分组消息1", 
          duration: 5000,
          groupConfig: { enabled: true }
        });
        setTimeout(() => {
          HMessage({ 
            type: "info", 
            message: "分组消息1", 
            duration: 5000,
            groupConfig: { enabled: true }
          });
        }, 400);
        
        // 禁用分组的消息
        setTimeout(() => {
          HMessage({ 
            type: "error", 
            message: "独立错误消息1", 
            duration: 5000,
            groupConfig: { enabled: false }
          });
        }, 800);
        setTimeout(() => {
          HMessage({ 
            type: "error", 
            message: "独立错误消息2", 
            duration: 5000,
            groupConfig: { enabled: false }
          });
        }, 1200);
      };

      // 快速连续分组测试
      const showQuickGrouping = () => {
        const messages = [
          { type: "success", message: "快速分组测试" },
          { type: "success", message: "快速分组测试" },
          { type: "success", message: "快速分组测试" },
          { type: "success", message: "快速分组测试" },
          { type: "success", message: "快速分组测试" }
        ];
        
        messages.forEach((msg, index) => {
          setTimeout(() => {
            HMessage({
              ...msg,
              duration: 3000,
              groupConfig: { enabled: true }
            });
          }, index * 100);
        });
      };
      
      return { 
        showBasicGrouping, 
        showTypeGrouping, 
        showMixedGrouping, 
        showQuickGrouping 
      };
    },
    template: `
      <div style="padding: 20px;">
        <h3 style="margin-bottom: 20px; color: #333;">Message组件分组功能演示</h3>
        
        <div style="display: flex; flex-direction: column; gap: 15px;">
          <div>
            <h4 style="margin-bottom: 10px; color: #666;">1. 基础分组功能</h4>
            <button @click="showBasicGrouping" style="padding: 8px 16px; background: #409eff; color: white; border: none; border-radius: 4px; cursor: pointer;">
              显示基础分组消息
            </button>
            <p style="margin-top: 8px; color: #999; font-size: 14px;">
              相同内容的消息会被自动分组，显示计数
            </p>
          </div>

          <div>
            <h4 style="margin-bottom: 10px; color: #666;">2. 自定义分组依据</h4>
            <button @click="showTypeGrouping" style="padding: 8px 16px; background: #67c23a; color: white; border: none; border-radius: 4px; cursor: pointer;">
              显示类型分组消息
            </button>
            <p style="margin-top: 8px; color: #999; font-size: 14px;">
              根据消息类型分组，相同类型的消息会合并显示
            </p>
          </div>

          <div>
            <h4 style="margin-bottom: 10px; color: #666;">3. 混合分组模式</h4>
            <button @click="showMixedGrouping" style="padding: 8px 16px; background: #e6a23c; color: white; border: none; border-radius: 4px; cursor: pointer;">
              显示混合分组消息
            </button>
            <p style="margin-top: 8px; color: #999; font-size: 14px;">
              同时展示启用分组和禁用分组的消息
            </p>
          </div>

          <div>
            <h4 style="margin-bottom: 10px; color: #666;">4. 快速连续分组</h4>
            <button @click="showQuickGrouping" style="padding: 8px 16px; background: #f56c6c; color: white; border: none; border-radius: 4px; cursor: pointer;">
              显示快速分组消息
            </button>
            <p style="margin-top: 8px; color: #999; font-size: 14px;">
              快速连续发送相同消息，测试分组响应性能
            </p>
          </div>
        </div>

        <div style="margin-top: 30px; padding: 15px; background: #f5f7fa; border-radius: 6px;">
          <h4 style="margin-bottom: 10px; color: #333;">分组功能说明：</h4>
          <ul style="color: #666; line-height: 1.6; margin: 0; padding-left: 20px;">
            <li><strong>基础分组</strong>：相同内容的消息自动合并，右上角显示计数</li>
            <li><strong>自定义分组</strong>：可通过groupBy函数自定义分组依据</li>
            <li><strong>分组配置</strong>：通过groupConfig.enabled控制是否启用分组</li>
            <li><strong>计数显示</strong>：分组消息右上角会显示重复次数</li>
            <li><strong>性能优化</strong>：避免重复消息占用过多屏幕空间</li>
          </ul>
        </div>
      </div>
    `,
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step("测试基础分组功能", async () => {
      await userEvent.click(canvas.getByText("显示基础分组消息"));
    });
    
    await step("测试类型分组功能", async () => {
      await userEvent.click(canvas.getByText("显示类型分组消息"));
    });
    
    await step("测试混合分组功能", async () => {
      await userEvent.click(canvas.getByText("显示混合分组消息"));
    });
    
    await step("测试快速分组功能", async () => {
      await userEvent.click(canvas.getByText("显示快速分组消息"));
    });
  },
};

export default meta;
