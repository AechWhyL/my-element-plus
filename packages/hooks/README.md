# Hooks 包

## 概述

这个包包含了项目中使用的各种组合式函数（Composables），提供了可复用的逻辑封装，包括键盘事件管理、点击外部检测、弹出层定位等功能。

## 安装

```bash
pnpm add @my-elementplus/hooks
```

## 使用方式

```typescript
import { useKeyEvents, useClickOutside, usePopper } from '@my-elementplus/hooks'
```

## 钩子函数列表

### useKeyEvents

**描述**: 强大的键盘事件管理钩子函数，支持基础按键、修饰键组合、全局事件监听等功能

**类型签名**: 
```typescript
function useKeyEvents(options: KeyEventOptions): KeyEventReturn
```

**参数**:
- `options.target` - 目标DOM元素，可以是响应式引用或直接的元素引用
- `options.keys` - 允许监听的按键列表，只有在此列表中的按键才会触发回调
- `options.modifiers` - 全局修饰键要求，适用于所有按键
- `options.onKeyDown` - 按键按下时的事件回调映射
- `options.onKeyUp` - 按键释放时的事件回调映射
- `options.onKeyPress` - 按键按下时的事件回调映射（字符键）
- `options.global` - 是否启用全局事件监听，不需要目标元素
- `options.preventDefault` - 是否阻止默认行为
- `options.stopPropagation` - 是否阻止事件冒泡

**返回值**:
- `isPressed` - 响应式的按键按下状态，true表示有按键被按下
- `pressedKeys` - 响应式的当前按下按键列表
- `bindKeyboardEvents` - 绑定键盘事件到目标元素的方法
- `bindGlobalEvents` - 绑定全局键盘事件的方法
- `addKeyListener` - 动态添加键盘监听器的方法
- `removeKeyListener` - 动态移除键盘监听器的方法
- `destroy` - 清理所有事件监听器的方法

**基础用法**:
```typescript
import { useKeyEvents } from '@my-elementplus/hooks'

const { bindKeyboardEvents } = useKeyEvents({
  target: targetRef,
  keys: ['Enter', 'Escape'],
  onKeyDown: {
    'Enter': () => console.log('Enter pressed'),
    'Escape': () => console.log('Escape pressed')
  }
})

bindKeyboardEvents()
```

**高级用法**:
```typescript
import { useKeyEvents } from '@my-elementplus/hooks'

const { bindKeyboardEvents, isPressed, pressedKeys, addKeyListener } = useKeyEvents({
  target: targetRef,
  keys: ['s', 'z'],
  onKeyDown: {
    'Ctrl+s': () => save(),
    'Ctrl+Shift+z': () => redo(),
    'Ctrl+z': () => undo()
  }
})

// 动态添加监听器
addKeyListener('Space', () => console.log('Space pressed'))

// 响应式状态
console.log(isPressed.value) // 是否有按键被按下
console.log(pressedKeys.value) // 当前按下的按键列表

bindKeyboardEvents()
```

**注意事项**:
- 确保在组件挂载后再调用`bindKeyboardEvents()`，否则目标元素可能为null
- 全局事件监听不需要目标元素，但会监听整个文档的键盘事件
- 修饰键组合匹配采用优先级策略，修饰键最多的组合优先匹配
- 组件卸载时会自动清理事件监听器，防止内存泄漏

### useClickOutside

**描述**: 检测点击元素外部的事件钩子函数，常用于下拉菜单、模态框等组件的关闭逻辑

**类型签名**: 
```typescript
function useClickOutside(target: Ref<HTMLElement | null>, callback: () => void): void
```

**参数**:
- `target` - 目标DOM元素的响应式引用
- `callback` - 点击外部时触发的回调函数

**返回值**: 无返回值

**基础用法**:
```typescript
import { useClickOutside } from '@my-elementplus/hooks'

const targetRef = ref<HTMLDivElement | null>(null)

useClickOutside(targetRef, () => {
  console.log('Clicked outside')
})
```

**高级用法**:
```typescript
import { useClickOutside } from '@my-elementplus/hooks'

const targetRef = ref<HTMLDivElement | null>(null)
const isOpen = ref(false)

useClickOutside(targetRef, () => {
  isOpen.value = false
})
```

**注意事项**:
- 目标元素必须通过ref引用，不能直接传递DOM元素
- 回调函数会在点击外部时立即触发
- 组件卸载时会自动清理事件监听器

### usePopper
**描述**: 基于Popper.js的弹出层定位钩子函数，提供精确的弹出层定位和箭头显示功能

**类型签名**: 
```typescript
function usePopper(options: PopperOptions): PopperReturn
```

**参数**:
- `options.trigger` - 触发元素的引用
- `options.content` - 弹出层内容的引用
- `options.arrow` - 箭头元素的引用
- `options.placement` - 弹出层的位置，如'top', 'bottom', 'left', 'right'
- `options.offset` - 弹出层与触发元素的偏移距离

**返回值**:
- `styles` - 弹出层和箭头的样式对象
- `attributes` - 弹出层的属性对象
- `update` - 更新定位的方法
- `destroy` - 销毁popper实例的方法

**基础用法**:
```typescript
import { usePopper } from '@my-elementplus/hooks'

const triggerRef = ref<HTMLButtonElement | null>(null)
const contentRef = ref<HTMLDivElement | null>(null)
const arrowRef = ref<HTMLDivElement | null>(null)

const { styles, attributes } = usePopper({
  trigger: triggerRef,
  content: contentRef,
  arrow: arrowRef,
  placement: 'bottom'
})
```

**高级用法**:
```typescript
import { usePopper } from '@my-elementplus/hooks'

const { styles, attributes, update, destroy } = usePopper({
  trigger: triggerRef,
  content: contentRef,
  arrow: arrowRef,
  placement: 'bottom-start',
  offset: [0, 8]
})

// 动态更新位置
onMounted(() => {
  update()
})

// 组件卸载时清理
onBeforeUnmount(() => {
  destroy()
})
```

**注意事项**:
- 所有ref引用必须在组件挂载后才能正确获取
- 弹出层内容必须设置`position: absolute`或`position: fixed`
- 箭头元素需要设置适当的定位样式
- 动态内容变化后需要调用`update()`方法重新计算位置

## 类型定义

### KeyEventOptions
键盘事件钩子函数的配置选项接口
```typescript
interface KeyEventOptions {
  target?: Ref<HTMLElement | null> | HTMLElement;
  keys?: string[];
  modifiers?: KeyModifiers;
  onKeyDown?: KeyEventCallbacks;
  onKeyUp?: KeyEventCallbacks;
  onKeyPress?: KeyEventCallbacks;
  global?: boolean;
  preventDefault?: boolean;
  stopPropagation?: boolean;
}
```

### KeyModifiers
键盘修饰键配置接口
```typescript
interface KeyModifiers {
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
}
```

### PopperOptions
弹出层定位配置选项
```typescript
interface PopperOptions {
  trigger: Ref<HTMLElement | null>;
  content: Ref<HTMLElement | null>;
  arrow?: Ref<HTMLElement | null>;
  placement?: Placement;
  offset?: [number, number];
}
```

## 最佳实践

- **性能优化**: 使用`computed`和`watch`优化响应式更新，避免不必要的重新计算
- **内存管理**: 确保在组件卸载时调用`destroy()`方法，防止内存泄漏
- **类型安全**: 充分利用TypeScript的类型系统，为所有参数和返回值提供准确的类型定义
- **错误处理**: 在关键操作前进行边界检查，如检查DOM元素是否存在
- **代码复用**: 将通用的逻辑抽象为独立的hooks，提高代码的可维护性

## 贡献指南

### 开发流程
1. 在`packages/hooks/`目录下创建新的hook文件
2. 使用TypeScript编写hook函数，包含完整的类型定义
3. 编写对应的测试文件，确保测试覆盖率
4. 按照`hooks-readme-format.mdc`规范编写文档
5. 在`packages/hooks/index.ts`中导出新的hook

### 代码规范
- 使用Vue 3 Composition API语法
- 遵循TypeScript严格模式
- 所有公共API必须包含JSDoc注释
- 测试文件使用`.test.tsx`扩展名
- 确保hook函数在组件卸载时自动清理资源

### 文档要求
- 每个hook必须有完整的README.md文档
- 包含基础用法和高级用法示例
- 详细说明所有参数和返回值
- 提供使用注意事项和最佳实践
- 示例代码必须能够直接运行
