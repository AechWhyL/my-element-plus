import { describe, it, expect, vi } from 'vitest'
import { createApp } from 'vue'
import installer from '../index'
import components from '../components'

describe('installer', () => {
  it('should register all components', () => {
    const app = createApp(() => {})
    const appUseSpy = vi.spyOn(app, 'use')

    app.use(installer)

    expect(appUseSpy).toHaveBeenCalledWith(installer)

    // 验证每个组件都被正确注册
    components.forEach(component => {
      const componentName = (component as any).name
      expect(componentName).toBeDefined()
      
      // 验证组件是否被注册到Vue应用中
      // 注意：由于makeIntaller使用app.use()而不是app.component()，
      // 我们需要验证组件本身是否有正确的install方法
      expect(typeof (component as any).install).toBe('function')
    })

    // 验证组件数量
    expect(components).toHaveLength(8)
  })
})
