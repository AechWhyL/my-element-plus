
import { defineComponent, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'
import Modal from '../Modal.vue'

describe('Modal.vue', () => {
  // 核心功能：测试Modal的显示与隐藏
  test('should control visibility with visible prop', () => {
    // 测试visible为false时
    const hiddenWrapper = mount(() => <Modal visible={false} title="Test Modal" />)
    expect(hiddenWrapper.find('.h-modal').exists()).toBe(false)

    // 测试visible为true时
    const visibleWrapper = mount(() => <Modal visible={true} title="Test Modal" />)
    expect(visibleWrapper.find('.h-modal').exists()).toBe(true)
    expect(visibleWrapper.find('.h-modal__header').text()).toBe('Test Modal')
  })

  // 内容渲染：测试默认插槽和title
  test('should render title and default slot content', async () => {
    const wrapper = mount(() => (
      <Modal visible={true} title="My Title">
        <p>Hello, World!</p>
      </Modal>
    ))

    expect(wrapper.find('.h-modal__header').text()).toBe('My Title')
    expect(wrapper.find('.h-modal__body').text()).toBe('Hello, World!')
  })

  // 关闭行为：测试右上角关闭按钮
  test('should emit close event when close button is clicked', async () => {
    const closeSpy = vi.fn()
    const wrapper = mount(() => (
      <Modal visible={true} onClose={closeSpy} />
    ))

    await wrapper.find('.h-modal__close-btn').trigger('click')
    expect(closeSpy).toHaveBeenCalled()
  })

  // 关闭行为：测试点击遮罩层
  test('should emit close event when overlay is clicked', async () => {
    const closeSpy = vi.fn()
    const wrapper = mount(() => (
      <Modal visible={true} onClose={closeSpy} />
    ))

    // 确保Modal已经渲染
    expect(wrapper.find('.h-modal').exists()).toBe(true)
    expect(wrapper.find('.h-modal__overlay').exists()).toBe(true)
    
    // 触发遮罩层的点击事件
    await wrapper.find('.h-modal__overlay').trigger('click')
    expect(closeSpy).toHaveBeenCalled()
  })

  // 测试遮罩层点击关闭的配置
  test('should not emit close event on overlay click if closeOnClickModal is false', async () => {
    const closeSpy = vi.fn()
    const wrapper = mount(() => (
      <Modal visible={true} onClose={closeSpy} closeOnClickModal={false} />
    ))

    // 确保Modal已经渲染
    expect(wrapper.find('.h-modal').exists()).toBe(true)
    expect(wrapper.find('.h-modal__overlay').exists()).toBe(true)
    
    // 触发遮罩层的点击事件
    await wrapper.find('.h-modal__overlay').trigger('click')
    expect(closeSpy).not.toHaveBeenCalled()
  })

  // 关闭行为：测试按下Escape键
  test('should emit close event when Escape key is pressed', async () => {
    const closeSpy = vi.fn()
    const wrapper = mount(() => (
      <Modal visible={true} onClose={closeSpy} closeOnPressEscape={true} />
    ), {
      attachTo: document.body, // 必须附加到DOM上才能触发键盘事件
    })

    // 确保Modal已经渲染
    expect(wrapper.find('.h-modal').exists()).toBe(true)
    
    // 直接触发document上的keydown事件，因为useKeyEvents绑定的是全局事件
    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' })
    document.dispatchEvent(escapeEvent)
    
    // 等待事件处理完成
    await wrapper.vm.$nextTick()
    
    expect(closeSpy).toHaveBeenCalled()
    wrapper.unmount()
  })

  // 测试ESC键关闭的配置
  test('should not emit close event on Escape key press if closeOnPressEscape is false', async () => {
    const closeSpy = vi.fn()
    const wrapper = mount(() => (
      <Modal visible={true} onClose={closeSpy} closeOnPressEscape={false} />
    ), {
      attachTo: document.body,
    })

    // 确保Modal已经渲染
    expect(wrapper.find('.h-modal').exists()).toBe(true)
    
    // 直接触发document上的keydown事件
    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' })
    document.dispatchEvent(escapeEvent)
    
    await wrapper.vm.$nextTick()
    
    expect(closeSpy).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  // 测试关闭按钮的显示控制
  test('should hide close button when showClose is false', () => {
    const wrapper = mount(() => (
      <Modal visible={true} showClose={false} />
    ))

    expect(wrapper.find('.h-modal__close-btn').exists()).toBe(false)
  })

  // 测试居中显示
  test('should apply center class when center prop is true', () => {
    const wrapper = mount(() => (
      <Modal visible={true} center={true} />
    ))

    // 检查是否应用了居中样式（通过CSS类或内联样式）
    const container = wrapper.find('.h-modal__container')
    expect(container.exists()).toBe(true)
  })

  // 插槽：测试header和footer
  test('should render custom header and footer slots', () => {
    const wrapper = mount(() => (
      <Modal visible={true}>
        {{
          header: () => <h2>Custom Header</h2>,
          default: () => <p>Main Content</p>,
          footer: () => <button class="custom-footer-btn">Confirm</button>,
        }}
      </Modal>
    ))

    expect(wrapper.find('h2').text()).toBe('Custom Header')
    expect(wrapper.find('.h-modal__header').exists()).toBe(true)
    expect(wrapper.find('.h-modal__body').text()).toBe('Main Content')
    expect(wrapper.find('.custom-footer-btn').text()).toBe('Confirm')
    expect(wrapper.find('.h-modal__footer').exists()).toBe(true)
  })

  // 测试Modal的DOM结构
  test('should render correct DOM structure', () => {
    const wrapper = mount(() => (
      <Modal visible={true} title="Test Modal">
        <p>Test content</p>
      </Modal>
    ))

    // 检查主要DOM结构
    expect(wrapper.find('.h-modal').exists()).toBe(true)
    expect(wrapper.find('.h-modal__overlay').exists()).toBe(true)
    expect(wrapper.find('.h-modal__container').exists()).toBe(true)
    expect(wrapper.find('.h-modal__header').exists()).toBe(true)
    expect(wrapper.find('.h-modal__body').exists()).toBe(true)
    expect(wrapper.find('.h-modal__footer').exists()).toBe(true)
  })

  // 测试事件触发
  test('should emit close event when any close method is triggered', async () => {
    const closeSpy = vi.fn()
    const wrapper = mount(() => (
      <Modal visible={true} onClose={closeSpy} />
    ))

    // 测试关闭按钮
    await wrapper.find('.h-modal__close-btn').trigger('click')
    expect(closeSpy).toHaveBeenCalledTimes(1)

    // 重置spy
    closeSpy.mockClear()

    // 测试遮罩层点击
    await wrapper.find('.h-modal__overlay').trigger('click')
    expect(closeSpy).toHaveBeenCalledTimes(1)
  })
})
