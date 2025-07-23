import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Alert from './Alert.vue'

describe('Alert.vue', () => {
  it('should render title and description correctly', () => {
    const title = 'Test Title'
    const description = 'This is a test description.'
    const wrapper = mount(Alert, {
      props: { title, description },
    })

    expect(wrapper.text()).toContain(title)
    expect(wrapper.text()).toContain(description)
  })

  it.each(['success', 'info', 'warning', 'error'] as const)(
    'should apply correct class for type %s',
    (type) => {
      const wrapper = mount(Alert, {
        props: { title: 'Test', type },
      })
      // 假设 class 命名遵循 BEM 风格
      expect(wrapper.find(`.h-alert--${type}`).exists()).toBe(true)
    },
  )

  it('should emit close event when close button is clicked', async () => {
    const wrapper = mount(Alert, {
      props: { title: 'Test', closable: true },
    })

    const closeButton = wrapper.find('.h-alert__close')
    expect(closeButton.exists()).toBe(true)

    await closeButton.trigger('click')
    expect(wrapper.emitted()).toHaveProperty('close')
  })

  it('should not render close button when closable is false', () => {
    const wrapper = mount(Alert, {
      props: { title: 'Test', closable: false },
    })
    expect(wrapper.find('.h-alert__close').exists()).toBe(false)
  })

  // it('should render custom close text', () => {
  //   const closeText = 'Close Me'
  //   const wrapper = mount(Alert, {
  //     props: { title: 'Test', closable: true, closeText },
  //   })
  //   expect(wrapper.find('h-alert__close').text()).toBe(closeText)
  // })

  it('should show an icon when showIcon is true', () => {
    const wrapper = mount(Alert, {
      props: { title: 'Test', showIcon: true },
    })
    expect(wrapper.find('.h-alert__icon').exists()).toBe(true)
  })

  it('should not show an icon when showIcon is false', () => {
    const wrapper = mount(Alert, {
      props: { title: 'Test', showIcon: false },
    })
    expect(wrapper.find('.h-alert__icon').exists()).toBe(false)
  })

  it('should be centered when center is true', () => {
    const wrapper = mount(Alert, {
      props: { title: 'Test', center: true },
    })
    expect(wrapper.find('.is-center').exists()).toBe(true)
  })

  it.each(['light', 'dark'] as const)(
    'should have correct effect class for %s',
    (effect) => {
      const wrapper = mount(Alert, {
        props: { title: 'Test', effect },
      })
      expect(wrapper.find(`.h-alert--${effect}`).exists()).toBe(true)
    },
  )

  it('should render default slot content', () => {
    const slotContent = 'Custom slot content'
    const wrapper = mount(Alert, {
      props: { title: 'Test' },
      slots: {
        default: slotContent,
      },
    })
    expect(wrapper.text()).toContain(slotContent)
  })

  it('should render title slot and override title prop', () => {
    const titleProp = 'Prop Title'
    const titleSlot = 'Slot Title'
    const wrapper = mount(Alert, {
      props: { title: titleProp },
      slots: {
        title: titleSlot,
      },
    })
    expect(wrapper.text()).toContain(titleSlot)
    expect(wrapper.text()).not.toContain(titleProp)
  })

  it('should render custom icon slot and override default icon', () => {
    const wrapper = mount(Alert, {
      props: { title: 'Test', showIcon: true },
      slots: {
        // 在 @vue/test-utils 中，可以直接传递 HTML 字符串
        icon: '<i class="custom-icon"></i>',
      },
    })
    expect(wrapper.find('.custom-icon').exists()).toBe(true)
    // 默认图标不应该被渲染
    expect(wrapper.find('.header-icon.default-icon').exists()).toBe(false)
  })
})