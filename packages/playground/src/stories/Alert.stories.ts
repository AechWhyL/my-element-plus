import type { Meta, StoryObj, ArgTypes } from "@storybook/vue3-vite";
import { HAlert } from "hyl-fake-element-plus";
import { fn } from "storybook/test";
import "hyl-fake-element-plus/dist/es/styles/index.css";
import "hyl-fake-element-plus/dist/es/styles/Alert.css";

type Story = StoryObj<typeof HAlert> & { argTypes?: ArgTypes };

const meta: Meta<typeof HAlert> = {
  title: "Components/Alert",
  component: HAlert,
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: { type: "text" },
    },
    description: {
      control: { type: "text" },
    },
    type: {
      control: { type: "select" },
      options: ["success", "info", "warning", "error"],
    },
    effect: {
      control: { type: "select" },
      options: ["light", "dark"],
    },
    closable: {
      control: "boolean",
    },
    showIcon: {
      control: "boolean",
    },
    center: {
      control: "boolean",
    },
    duration: {
      control: "number",
    },
  },
  args: {
    onClose: fn(),
  },
};

export default meta;

const container = (val: string) => `
<div style="display: flex; flex-direction: column; gap: 10px; max-width: 600px;">
  ${val}
</div>
`;

export const Default: Story = {
  args: {
    title: "Default Alert",
    description: "This is the default alert component.",
  },
  render: (args) => ({
    components: { HAlert },
    setup() {
      return { args };
    },
    template: container('<HAlert v-bind="args" />'),
  }),
};

export const Types: Story = {
  name: "Alert Types",
  render: () => ({
    components: { HAlert },
    template: container(`
      <HAlert title="Success Alert" type="success" description="A success message." showIcon />
      <HAlert title="Info Alert" type="info" description="An info message." showIcon />
      <HAlert title="Warning Alert" type="warning" description="A warning message." showIcon />
      <HAlert title="Error Alert" type="error" description="An error message." showIcon />
    `),
  }),
};

export const DarkTheme: Story = {
  name: "Dark Theme",
  render: () => ({
    components: { HAlert },
    template: container(`
      <HAlert title="Success Alert" type="success" effect="dark" />
      <HAlert title="Info Alert" type="info" effect="dark" />
      <HAlert title="Warning Alert" type="warning" effect="dark" />
      <HAlert title="Error Alert" type="error" effect="dark" />
    `),
  }),
};

export const CustomContent: Story = {
  name: "Custom Content via Slots",
  render: (args) => ({
    components: { HAlert },
    setup() {
      return { args };
    },
    template: container(`
      <HAlert v-bind="args">
        <template #title>
          <h4>A Custom Title via Slot</h4>
        </template>
        <p>This is some <strong>complex content</strong> passed through the default slot.</p>
      </HAlert>
    `),
  }),
  args: {
    type: "info",
    showIcon: true,
    closable: false,
  },
};
