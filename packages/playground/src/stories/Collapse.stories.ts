import type { ArgTypes, Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { ErCollapse, ErCollapseItem } from 'hyl-fake-element-plus'
import 'hyl-fake-element-plus/dist/es/styles/index.css'
import 'hyl-fake-element-plus/dist/es/styles/Collapse.css'

type Story = StoryObj<typeof ErCollapse> & { argTypes?: ArgTypes }

const meta: Meta<typeof ErCollapse> = {
    title: 'Example/Collapse',
    component: ErCollapse,
    subcomponents: {
        ErCollapseItem
    },
    tags: ['autodocs'],
    argTypes: {
        accordion: {
            control: 'boolean'
        },
        modelValue: {
            control: { type: 'object' }
        }
    }
}

export const Default: Story = {
    args: {
        accordion: true,
        modelValue: ['1','2']
    },
    render: (args) => ({
        components: { ErCollapse, ErCollapseItem },
        setup() {
            const modelValue = ref(args.modelValue)
            return { args, modelValue }
        },
        template: `
      <er-collapse :modelValue="args.modelValue" :accordion="args.accordion">
        <er-collapse-item name="1" title="Consistency">
          <div>
            Consistent with real life: in line with the process and logic of real
            life, and comply with languages and habits that the users are used to;
          </div>
        </er-collapse-item>
        <er-collapse-item name="2" title="Feedback">
          <div>
            Operation feedback: enable the users to clearly perceive their
            operations by style updates and interactive effects;
          </div>
        </er-collapse-item>
        <er-collapse-item name="3" title="Efficiency">
          <div>
            Simplify the process: keep operating process simple and intuitive;
          </div>
        </er-collapse-item>
        <er-collapse-item name="4" title="Controllability" disabled>
          <div>
            Decision making: giving advices about operations is acceptable, but do
            not make decisions for the users;
          </div>
        </er-collapse-item>
      </er-collapse>
    `
    })
}

export default meta
