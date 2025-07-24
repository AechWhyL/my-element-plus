import { describe, it, expect, vi } from 'vitest'
import { createApp } from 'vue'
import installer from '../index'
import components from '../components'

describe('installer', () => {
  it('should register all components', () => {
    const app = createApp(() => {})
    const appUseSpy = vi.spyOn(app, 'use')
    const appComponentSpy = vi.spyOn(app, 'component')

    app.use(installer)

    expect(appUseSpy).toHaveBeenCalledWith(installer)

    components.forEach(component => {
      expect(appComponentSpy).toHaveBeenCalledWith((component  ).name, component)
    })
  })
})
