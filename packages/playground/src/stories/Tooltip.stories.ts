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
      options: ["top", "bottom", "left", "right"],
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
  },
  render: (args) => ({
    components: { HTooltip, ErButton },
    setup() {
      const virtualRef = ref<HTMLDivElement>();
      const onOver = (e: MouseEvent) => {
        virtualRef.value = e.target as HTMLDivElement;
      };
      return { args, virtualRef, onOver };
    },
    template: `

      <button @mouseover="onOver">
        虚拟触发1
      </button>

      <button @mouseover="onOver">
        虚拟触发2
      </button>

      <button @mouseover="onOver">
        虚拟触发3
      </button>
      
      <h-tooltip :content="args.content"
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
      >
        
      </h-tooltip>
    `,
  }),
};

export default meta;
