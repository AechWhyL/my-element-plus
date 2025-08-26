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

    components.forEach(component => {
      expect(typeof (component as any).install).toBe('function')
    })

  })
})
