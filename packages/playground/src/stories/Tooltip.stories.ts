import { ArgTypes, Meta, StoryObj } from "@storybook/vue3-vite";
import { ErButton, HTooltip } from "hyl-fake-element-plus";
import "hyl-fake-element-plus/dist/es/styles/index.css";
import "hyl-fake-element-plus/dist/es/styles/Button.css";
import "hyl-fake-element-plus/dist/es/styles/Tooltip.css";
import { ref } from "vue";

type Story = StoryObj<typeof HTooltip> & { argTypes?: ArgTypes };

const meta: Meta<typeof HTooltip> = {
  title: "Components/Tooltip",
  component: HTooltip,
  tags: ["autodocs"],
  argTypes: {
    content: {
      control: {
        type: "text",
      },
    },
    trigger: {
      control: {
        type: "select",
      },
      options: ["hover", "click", "focus"],
    },
    effect: {
      control: {
        type: "select",
      },
      options: ["dark", "light"],
    },
    showArrow: {
      control: {
        type: "boolean",
      },
    },
    showDelay: {
      control: {
        type: "number",
      },
    },
    offset: {
      control: {
        type: "number",
      },
    },
    hideDelay: {
      control: {
        type: "number",
      },
    },
    virtualTrigger: {
      control: {
        type: "boolean",
      },
    },
    virtualRef: {},
    disabled: {
      control: {
        type: "boolean",
      },
    },
    visible: {
      control: {
        type: "select",
      },
      options: [false, true, undefined],
    },
    placement: {
      control: {
        type: "select",
      },
      options: ["top", "bottom", "left", "right","top-start","top-end","bottom-start","bottom-end","left-start","left-end","right-start","right-end"],
    },
  },
};

export const Default: Story = {
  args: {
    content: "这是一个提示",
    placement: "top",
  },
  render: (args) => ({
    components: { HTooltip, ErButton },
    setup() {
      console.log(args)
      return { args };
    },
    template: `
      <h-tooltip :content="args.content"
      :show-arrow="args.showArrow"
      :show-delay="args.showDelay"
      :hide-delay="args.hideDelay"
      :offset="args.offset"
      :placement="args.placement"
      :trigger="args.trigger"
      :effect="args.effect"
      :disabled="args.disabled"
      :visible="args.visible"
      >
        <er-button>Hover me</er-button>
      </h-tooltip>
    `,
  }),
};

export const Controlled: Story = {
  args: {
    content: "这是一个提示",
    placement: "top",
  },
  render: (args) => ({
    components: { HTooltip, ErButton },
    setup() {
      return { args };
    },
    template: `
      <h-tooltip :content="args.content"
      :show-arrow="args.showArrow"
      :show-delay="args.showDelay"
      :hide-delay="args.hideDelay"
      :offset="args.offset"
      :visible="args.visible"
      :placement="args.placement"
      :trigger="args.trigger"
      :effect="args.effect"
      :disabled="args.disabled"
      >
        <er-button>Hover me</er-button>
      </h-tooltip>
    `,
  }),
};

export const VirtualTrigger: Story = {
  args: {
    content: "虚拟触发提示",
    placement: "top",
    trigger: "hover",
  },
  render: (args) => ({
    components: { HTooltip, ErButton },
    setup() {
      const virtualRef = ref<HTMLDivElement>();
      
      const onOver = (e: MouseEvent) => {
        const target = e.target as HTMLDivElement;
        virtualRef.value = target;
        console.log("虚拟引用设置:", target);
      };
      
      const onOut = () => {
        virtualRef.value = undefined;
      };
      
      return { args, virtualRef, onOver, onOut };
    },
    template: `
      <div style="display: flex; gap: 10px; margin-bottom: 20px;">
        <button 
          @mouseover="onOver" 
          style="padding: 8px 16px; border: 1px solid #ccc; border-radius: 4px; cursor: pointer;"
        >
          虚拟触发1
        </button>

        <button 
          @mouseover="onOver" 
          style="padding: 8px 16px; border: 1px solid #ccc; border-radius: 4px; cursor: pointer;"
        >
          虚拟触发2
        </button>

        <button 
          @mouseover="onOver" 
          style="padding: 8px 16px; border: 1px solid #ccc; border-radius: 4px; cursor: pointer;"
        >
          虚拟触发3
        </button>
      </div>
      
      <h-tooltip 
        :content="args.content"
        :show-arrow="args.showArrow"
        :show-delay="args.showDelay"
        :hide-delay="args.hideDelay"
        :offset="args.offset"
        :placement="args.placement"
        :trigger="args.trigger"
        :effect="args.effect"
        :virtual-trigger="true"
        :virtual-ref="virtualRef"
        :disabled="args.disabled"
        :visible="args.visible"
      >
        <!-- 虚拟触发模式下不需要子元素 -->
      </h-tooltip>
      
      <div style="margin-top: 20px; font-size: 12px; color: #666;">
        当前虚拟引用: {{ virtualRef ? '已设置' : '未设置' }}
      </div>
    `,
  }),
};

export const VirtualTriggerDebug: Story = {
  args: {
    content: "调试虚拟触发",
    placement: "top",
    trigger: "hover",
    virtualTrigger: true,
  },
  render: (args) => ({
    components: { HTooltip },
    setup() {
      const virtualRef = ref<HTMLDivElement>();
      const debugInfo = ref({
        lastEvent: '',
        virtualRefSet: false,
        timestamp: 0
      });
      
      const onOver = (e: MouseEvent) => {
        const target = e.target as HTMLDivElement;
        virtualRef.value = target;
        debugInfo.value = {
          lastEvent: 'mouseenter',
          virtualRefSet: true,
          timestamp: Date.now()
        };
        console.log("🔵 鼠标进入:", target.textContent, "虚拟引用已设置");
      };
      
      const onOut = () => {
        debugInfo.value = {
          lastEvent: 'mouseleave',
          virtualRefSet: false,
          timestamp: Date.now()
        };
        console.log("🔴 鼠标离开，准备清除虚拟引用");
        
        // 延迟清除，给tooltip内容区域的事件处理留出时间
        setTimeout(() => {
          if (virtualRef.value) {
            virtualRef.value = undefined;
            console.log("🗑️ 虚拟引用已清除");
          }
        }, 200);
      };
      
      return { args, virtualRef, onOver, onOut, debugInfo };
    },
    template: `
      <div style="padding: 20px; font-family: monospace;">
        <h3>虚拟触发调试模式</h3>
        
        <div style="display: flex; gap: 10px; margin-bottom: 20px;">
          <button 
            @mouseenter="onOver" 
            @mouseleave="onOut"
            style="padding: 10px 20px; border: 2px solid #409eff; border-radius: 6px; cursor: pointer; background: #f0f8ff;"
          >
            测试按钮1
          </button>

          <button 
            @mouseenter="onOver" 
            @mouseleave="onOut"
            style="padding: 10px 20px; border: 2px solid #67c23a; border-radius: 6px; cursor: pointer; background: #f0f9ff;"
          >
            测试按钮2
          </button>
        </div>
        
        <h-tooltip 
          :content="args.content"
          :placement="args.placement"
          :trigger="args.trigger"
          :virtual-trigger="true"
          :virtual-ref="virtualRef"
          :show-arrow="true"
          :effect="'dark'"
        />
        
        <div style="margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 4px; font-size: 12px;">
          <h4>调试信息:</h4>
          <div>最后事件: <span style="color: #409eff;">{{ debugInfo.lastEvent }}</span></div>
          <div>虚拟引用状态: <span style="color: {{ debugInfo.virtualRefSet ? '#67c23a' : '#f56c6c' }}">{{ debugInfo.virtualRefSet ? '已设置' : '未设置' }}</span></div>
          <div>时间戳: {{ debugInfo.timestamp }}</div>
          <div>当前虚拟引用: {{ virtualRef ? '✅ 有效' : '❌ 无效' }}</div>
        </div>
        
        <div style="margin-top: 15px; font-size: 11px; color: #666;">
          💡 提示: 查看控制台日志以获取详细的事件信息
        </div>
      </div>
    `,
  }),
};

export default meta;
