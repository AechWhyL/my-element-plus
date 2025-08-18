import type { ArgTypes, Meta, StoryObj } from "@storybook/vue3-vite";
import { fn, within, userEvent, expect } from "storybook/test";
import { ref } from "vue";

import { HModal } from "hyl-fake-element-plus";
import "hyl-fake-element-plus/dist/es/styles/index.css";
import "hyl-fake-element-plus/dist/es/styles/Modal.css";

type Story = StoryObj<typeof HModal> & { argTypes?: ArgTypes };

const meta: Meta<typeof HModal> = {
  title: "Example/Modal",
  component: HModal,
  tags: ["autodocs"],
  argTypes: {
    visible: {
      control: "boolean",
      description: "控制Modal的显示/隐藏状态",
    },
    title: {
      control: "text",
      description: "Modal标题",
    },
    showClose: {
      control: "boolean",
      description: "是否显示关闭按钮",
    },
    center: {
      control: "boolean",
      description: "是否居中显示",
    },
    closeOnClickModal: {
      control: "boolean",
      description: "点击遮罩层是否关闭Modal",
    },
    closeOnPressEscape: {
      control: "boolean",
      description: "按ESC键是否关闭Modal",
    },
    lockScroll: {
      control: "boolean",
      description: "是否锁定页面滚动",
    },
  },
  args: {
    onClose: fn(),
  },
};

const container = (val: string) => `
<div style="margin: 20px; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
  ${val}
</div>
`;

// 基础Modal示例
export const Default: Story = {
  args: {
    title: "基础Modal",
  },
  render: (args) => ({
    components: { HModal },
    setup() {
      const visible = ref(false);
      const handleOpen = () => {
        visible.value = true;
      };
      const handleClose = () => {
        visible.value = false;
      };
      return { args, visible, handleOpen, handleClose };
    },
    template: container(`
      <div>
        <button @click="handleOpen" style="padding: 8px 16px; background: #409eff; color: white; border: none; border-radius: 4px; cursor: pointer;">
          打开Modal
        </button>
        <h-modal :visible="visible" v-bind="args" @close="handleClose">
          <p>这是一个基础的Modal示例，包含默认内容。</p>
          <p>你可以点击关闭按钮或遮罩层来关闭它。</p>
        </h-modal>
      </div>
    `),
  }),
};

// 自定义标题和内容
export const CustomContent: Story = {
  args: {
    title: "自定义内容Modal",
  },
  render: (args) => ({
    components: { HModal },
    setup() {
      const visible = ref(false);
      const handleOpen = () => {
        visible.value = true;
      };
      const handleClose = () => {
        visible.value = false;
      };
      return { args, visible, handleOpen, handleClose };
    },
    template: container(`
      <div>
        <button @click="handleOpen" style="padding: 8px 16px; background: #67c23a; color: white; border: none; border-radius: 4px; cursor: pointer;">
          打开自定义Modal
        </button>
        <h-modal :visible="visible" v-bind="args" @close="handleClose">
          <div style="text-align: center; padding: 20px;">
            <h3 style="color: #409eff; margin-bottom: 16px;">欢迎使用我们的组件库</h3>
            <p style="line-height: 1.6; color: #606266;">
              这是一个功能丰富的Modal组件，支持多种配置选项和自定义内容。
              你可以根据需要调整标题、内容、样式等。
            </p>
            <div style="margin-top: 20px;">
              <button style="padding: 8px 16px; background: #409eff; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">
                确认
              </button>
              <button @click="handleClose" style="padding: 8px 16px; background: #909399; color: white; border: none; border-radius: 4px; cursor: pointer;">
                取消
              </button>
            </div>
          </div>
        </h-modal>
      </div>
    `),
  }),
};

// 自定义插槽
export const CustomSlots: Story = {
  args: {},
  render: (args) => ({
    components: { HModal },
    setup() {
      const visible = ref(false);
      const handleOpen = () => {
        visible.value = true;
      };
      const handleClose = () => {
        visible.value = false;
      };
      return { args, visible, handleOpen, handleClose };
    },
    template: container(`
      <div>
        <button @click="handleOpen" style="padding: 8px 16px; background: #e6a23c; color: white; border: none; border-radius: 4px; cursor: pointer;">
          打开自定义插槽Modal
        </button>
        <h-modal :visible="visible" v-bind="args" @close="handleClose">
          <template #header>
            <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
              <span style="font-size: 18px; font-weight: bold; color: #303133;">自定义头部</span>
              <span style="font-size: 14px; color: #909399;">ID: #12345</span>
            </div>
          </template>
          
          <div style="padding: 20px;">
            <p style="margin-bottom: 16px;">这是自定义头部插槽的示例。</p>
            <p style="margin-bottom: 16px;">你可以在这里放置任何内容，包括图标、按钮、文本等。</p>
            <div style="background: #f5f7fa; padding: 16px; border-radius: 4px;">
              <p style="margin: 0; color: #606266;">提示：使用插槽可以创建更灵活的Modal布局。</p>
            </div>
          </div>
          
          <template #footer>
            <div style="display: flex; justify-content: flex-end; gap: 10px;">
              <button @click="handleClose" style="padding: 8px 16px; background: #909399; color: white; border: none; border-radius: 4px; cursor: pointer;">
                取消
              </button>
              <button @click="handleClose" style="padding: 8px 16px; background: #409eff; color: white; border: none; border-radius: 4px; cursor: pointer;">
                确认
              </button>
            </div>
          </template>
        </h-modal>
      </div>
    `),
  }),
};

// 禁用遮罩层点击关闭
export const NoOverlayClose: Story = {
  args: {
    title: "禁用遮罩层关闭",
    closeOnClickModal: false,
  },
  render: (args) => ({
    components: { HModal },
    setup() {
      const visible = ref(false);
      const handleOpen = () => {
        visible.value = true;
      };
      const handleClose = () => {
        visible.value = false;
      };
      return { args, visible, handleOpen, handleClose };
    },
    template: container(`
      <div>
        <button @click="handleOpen" style="padding: 8px 16px; background: #f56c6c; color: white; border: none; border-radius: 4px; cursor: pointer;">
          打开Modal（禁用遮罩层关闭）
        </button>
        <h-modal :visible="visible" v-bind="args" @close="handleClose">
          <p>这个Modal禁用了遮罩层点击关闭功能。</p>
          <p>你只能通过关闭按钮或ESC键来关闭它。</p>
          <p style="color: #e6a23c; font-weight: bold;">试试点击遮罩层，它不会关闭！</p>
        </h-modal>
      </div>
    `),
  }),
};

// 禁用ESC键关闭
export const NoEscapeClose: Story = {
  args: {
    title: "禁用ESC键关闭",
    closeOnPressEscape: false,
  },
  render: (args) => ({
    components: { HModal },
    setup() {
      const visible = ref(false);
      const handleOpen = () => {
        visible.value = true;
      };
      const handleClose = () => {
        visible.value = false;
      };
      return { args, visible, handleOpen, handleClose };
    },
    template: container(`
      <div>
        <button @click="handleOpen" style="padding: 8px 16px; background: #909399; color: white; border: none; border-radius: 4px; cursor: pointer;">
          打开Modal（禁用ESC键关闭）
        </button>
        <h-modal :visible="visible" v-bind="args" @close="handleClose">
          <p>这个Modal禁用了ESC键关闭功能。</p>
          <p>你只能通过关闭按钮或点击遮罩层来关闭它。</p>
          <p style="color: #e6a23c; font-weight: bold;">试试按ESC键，它不会关闭！</p>
        </h-modal>
      </div>
    `),
  }),
};

// 居中显示
export const Centered: Story = {
  args: {
    title: "居中显示Modal",
    center: true,
  },
  render: (args) => ({
    components: { HModal },
    setup() {
      const visible = ref(false);
      const handleOpen = () => {
        visible.value = true;
      };
      const handleClose = () => {
        visible.value = false;
      };
      return { args, visible, handleOpen, handleClose };
    },
    template: container(`
      <div>
        <button @click="handleOpen" style="padding: 8px 16px; background: #409eff; color: white; border: none; border-radius: 4px; cursor: pointer;">
          打开居中Modal
        </button>
        <h-modal :visible="visible" v-bind="args" @close="handleClose">
          <div style="text-align: center; padding: 20px;">
            <p>这个Modal使用了居中显示模式。</p>
            <p>内容会在屏幕中央显示，提供更好的视觉体验。</p>
          </div>
        </h-modal>
      </div>
    `),
  }),
};

// 隐藏关闭按钮
export const NoCloseButton: Story = {
  args: {
    title: "无关闭按钮Modal",
    showClose: false,
  },
  render: (args) => ({
    components: { HModal },
    setup() {
      const visible = ref(false);
      const handleOpen = () => {
        visible.value = true;
      };
      const handleClose = () => {
        visible.value = false;
      };
      return { args, visible, handleOpen, handleClose };
    },
    template: container(`
      <div>
        <button @click="handleOpen" style="padding: 8px 16px; background: #67c23a; color: white; border: none; border-radius: 4px; cursor: pointer;">
          打开无关闭按钮Modal
        </button>
        <h-modal :visible="visible" v-bind="args" @close="handleClose">
          <div style="text-align: center; padding: 20px;">
            <p>这个Modal隐藏了关闭按钮。</p>
            <p>你只能通过点击遮罩层或按ESC键来关闭它。</p>
            <button @click="handleClose" style="margin-top: 16px; padding: 8px 16px; background: #409eff; color: white; border: none; border-radius: 4px; cursor: pointer;">
              手动关闭
            </button>
          </div>
        </h-modal>
      </div>
    `),
  }),
};

// 事件处理示例
export const EventHandling: Story = {
  args: {
    title: "事件处理示例",
  },
  render: (args) => ({
    components: { HModal },
    setup() {
      const visible = ref(false);
      const eventLog = ref<string[]>([]);

      const handleOpen = () => {
        visible.value = true;
        eventLog.value.push("Modal已打开");
      };

      const handleClose = () => {
        visible.value = false;
        eventLog.value.push("Modal已关闭");
      };

      return {
        args,
        visible,
        eventLog,
        handleOpen,
        handleClose,
      };
    },
    template: container(`
      <div>
        <button @click="handleOpen" style="padding: 8px 16px; background: #409eff; color: white; border: none; border-radius: 4px; cursor: pointer;">
          打开事件处理Modal
        </button>
        
        <h-modal
          :visible="visible" 
          v-bind="args"
          @close="handleClose"
        >
          <div style="padding: 20px;">
            <p>这个Modal演示了各种事件的触发。</p>
            <p>打开和关闭Modal时，下方会显示事件日志。</p>
            
            <div style="margin-top: 20px; padding: 16px; background: #f5f7fa; border-radius: 4px; max-height: 200px; overflow-y: auto;">
              <h4 style="margin: 0 0 10px 0; color: #303133;">事件日志：</h4>
              <div v-for="(log, index) in eventLog" :key="index" style="padding: 4px 0; color: #606266; font-family: monospace;">
                {{ log }}
              </div>
              <div v-if="eventLog.length === 0" style="color: #909399; font-style: italic;">
                暂无事件记录
              </div>
            </div>
          </div>
        </h-modal>
      </div>
    `),
  }),
};

export default meta;