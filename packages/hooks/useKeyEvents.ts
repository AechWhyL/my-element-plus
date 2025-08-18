import { ref, onBeforeUnmount, type Ref, computed, watch } from 'vue';

/**
 * 键盘修饰键配置接口
 * @interface KeyModifiers
 * @description 定义键盘事件的修饰键要求
 */
export interface KeyModifiers {
  /** 是否要求按下 Ctrl 键 */
  ctrl?: boolean;
  /** 是否要求按下 Shift 键 */
  shift?: boolean;
  /** 是否要求按下 Alt 键 */
  alt?: boolean;
  /** 是否要求按下 Meta 键 (Windows 键或 Command 键) */
  meta?: boolean;
}

/**
 * 键盘事件回调函数映射接口
 * @interface KeyEventCallbacks
 * @description 定义按键与回调函数的映射关系
 * @example
 * ```typescript
 * {
 *   'Enter': (event) => console.log('Enter pressed'),
 *   'Ctrl+s': (event) => console.log('Save'),
 *   'Ctrl+Shift+z': (event) => console.log('Redo')
 * }
 * ```
 */
export interface KeyEventCallbacks {
  /** 按键标识符，支持修饰键组合 (如 'Ctrl+s', 'Ctrl+Shift+z') */
  [key: string]: (event: KeyboardEvent) => void;
}

/**
 * 键盘事件钩子函数的配置选项接口
 * @interface KeyEventOptions
 * @description 定义 useKeyEvents 钩子函数的所有配置选项
 */
export interface KeyEventOptions {
  /** 目标DOM元素，可以是响应式引用或直接的元素引用 */
  target?: Ref<HTMLElement | null> | HTMLElement;
  /** 允许监听的按键列表，只有在此列表中的按键才会触发回调 */
  keys?: string[];
  /** 全局修饰键要求，适用于所有按键 */
  modifiers?: KeyModifiers;
  /** 按键按下时的事件回调映射 */
  onKeyDown?: KeyEventCallbacks;
  /** 按键释放时的事件回调映射 */
  onKeyUp?: KeyEventCallbacks;
  /** 按键按下时的事件回调映射 (字符键) */
  onKeyPress?: KeyEventCallbacks;
  /** 是否启用全局事件监听，不需要目标元素 */
  global?: boolean;
  /** 是否阻止默认行为 */
  preventDefault?: boolean;
  /** 是否阻止事件冒泡 */
  stopPropagation?: boolean;
}

export interface KeyEventReturn {
  isPressed: Ref<boolean>;
  pressedKeys: Ref<string[]>;
  bindKeyboardEvents: () => void;
  bindGlobalEvents: () => void;
  addKeyListener: (key: string, callback: (event: KeyboardEvent) => void, eventType?: 'keydown' | 'keyup' | 'keypress') => void;
  removeKeyListener: (key: string, eventType?: 'keydown' | 'keyup' | 'keypress') => void;
  destroy: () => void;
}

// 内部状态管理
interface InternalState {
  targetElement: HTMLElement | null;
  isBound: boolean;
  eventListeners: Map<string, (event: KeyboardEvent) => void>;
  globalEventListeners: Map<string, (event: KeyboardEvent) => void>;
}

// 创建修饰键字符串
const createModifierKey = (key: string, modifiers: KeyModifiers): string => {
  const parts: string[] = [];
  
  if (modifiers.ctrl) parts.push('Ctrl');
  if (modifiers.shift) parts.push('Shift');
  if (modifiers.alt) parts.push('Alt');
  if (modifiers.meta) parts.push('Meta');
  
  parts.push(key);
  return parts.join('+');
};

// 检查修饰键是否匹配
const checkModifiers = (event: KeyboardEvent, requiredModifiers: KeyModifiers): boolean => {
  if (requiredModifiers.ctrl && !event.ctrlKey) return false;
  if (requiredModifiers.shift && !event.shiftKey) return false;
  if (requiredModifiers.alt && !event.altKey) return false;
  if (requiredModifiers.meta && !event.metaKey) return false;
  return true;
};



export const useKeyEvents = (options: KeyEventOptions): KeyEventReturn => {
  // 响应式状态
  const isPressed = ref(false);
  const pressedKeys = ref<string[]>([]);
  
  // 内部状态
  const state: InternalState = {
    targetElement: null,
    isBound: false,
    eventListeners: new Map(),
    globalEventListeners: new Map(),
  };

  // 标记是否手动销毁
  let isManuallyDestroyed = false;

  // 内部回调存储，避免直接修改options
  const internalCallbacks = {
    keydown: { ...options.onKeyDown },
    keyup: { ...options.onKeyUp },
    keypress: { ...options.onKeyPress },
  };

  // 计算目标元素
  const targetElement = computed(() => {
    if (options.target) {
      return options.target instanceof HTMLElement ? options.target : options.target.value;
    }
    return null;
  });

  // 获取事件类型对应的回调映射
  const getEventCallbacks = (eventType: 'keydown' | 'keyup' | 'keypress'): KeyEventCallbacks => {
    switch (eventType) {
      case 'keydown': return internalCallbacks.keydown || {};
      case 'keyup': return internalCallbacks.keyup || {};
      case 'keypress': return internalCallbacks.keypress || {};
      default: return {};
    }
  };

    // 创建事件处理器
  const createEventHandler = (eventType: 'keydown' | 'keyup' | 'keypress') => {
    return (event: KeyboardEvent) => {
      const callbacks = getEventCallbacks(eventType);
      const key = event.key;
      
      // 检查是否有匹配的回调
      let matchedCallback: ((event: KeyboardEvent) => void) | undefined;
      let matchedKey: string | undefined;

      // 首先尝试精确匹配
      if (callbacks[key]) {
        matchedCallback = callbacks[key];
        matchedKey = key;
      } else {
        // 尝试修饰键组合匹配，优先匹配最精确的组合
        const modifierMatches: Array<{ callbackKey: string; callback: any; modifierCount: number }> = [];
        
        for (const [callbackKey, callback] of Object.entries(callbacks)) {
          if (callbackKey.includes('+')) {
            const parts = callbackKey.split('+');
            const keyPart = parts[parts.length - 1]; // 最后一个部分是按键
            if (keyPart === key) {
              const modifiers: KeyModifiers = {};
              if (callbackKey.includes('Ctrl')) modifiers.ctrl = true;
              if (callbackKey.includes('Shift')) modifiers.shift = true;
              if (callbackKey.includes('Alt')) modifiers.alt = true;
              if (callbackKey.includes('Meta')) modifiers.meta = true;
              
              if (checkModifiers(event, modifiers)) {
                const modifierCount = Object.values(modifiers).filter(Boolean).length;
                modifierMatches.push({ callbackKey, callback, modifierCount });
              }
            }
          }
        }
        
        // 选择修饰键最多的匹配（最精确的匹配）
        if (modifierMatches.length > 0) {
          const bestMatch = modifierMatches.reduce((best, current) => 
            current.modifierCount > best.modifierCount ? current : best
          );
          matchedCallback = bestMatch.callback as (event: KeyboardEvent) => void;
          matchedKey = bestMatch.callbackKey;
        }
      }

      // 检查是否在允许的keys列表中
      if (options.keys && options.keys.length > 0) {
        const isKeyAllowed = options.keys.some(allowedKey => {
          // 对于组合键，检查修饰键和按键是否匹配
          if (allowedKey.includes('+')) {
            const parts = allowedKey.split('+');
            const keyPart = parts[parts.length - 1];
            if (keyPart === key) {
              const modifiers: KeyModifiers = {};
              if (allowedKey.includes('Ctrl')) modifiers.ctrl = true;
              if (allowedKey.includes('Shift')) modifiers.shift = true;
              if (allowedKey.includes('Alt')) modifiers.alt = true;
              if (allowedKey.includes('Meta')) modifiers.meta = true;
              return checkModifiers(event, modifiers);
            }
            return false;
          }
          // 对于普通按键，直接比较
          return allowedKey === key;
        });
        
        if (!isKeyAllowed) {
          return; // 如果按键不在允许列表中，直接返回
        }
      }

      if (matchedCallback) {
        // 处理事件选项
        if (options.preventDefault) {
          event.preventDefault();
        }
        if (options.stopPropagation) {
          event.stopPropagation();
        }

        // 调用回调
        matchedCallback(event);

        // 更新按键状态
        if (eventType === 'keydown') {
          if (!pressedKeys.value.includes(matchedKey!)) {
            pressedKeys.value.push(matchedKey!);
          }
          isPressed.value = true;
        } else if (eventType === 'keyup') {
          const index = pressedKeys.value.indexOf(matchedKey!);
          if (index > -1) {
            pressedKeys.value.splice(index, 1);
          }
          isPressed.value = pressedKeys.value.length > 0;
        }
      }
    };
  };

  // 绑定键盘事件到目标元素
  const bindKeyboardEvents = () => {
    if (state.isBound || !targetElement.value) return;
    
    const element = targetElement.value;
    state.targetElement = element;
    state.isBound = true;

    // 绑定不同事件类型
    ['keydown', 'keyup', 'keypress'].forEach(eventType => {
      const handler = createEventHandler(eventType as 'keydown' | 'keyup' | 'keypress');
      state.eventListeners.set(eventType, handler);
      element.addEventListener(eventType, handler as EventListener);
    });
  };

  // 绑定全局事件
  const bindGlobalEvents = () => {
    if (options.global) {
      ['keydown', 'keyup', 'keypress'].forEach(eventType => {
        const handler = createEventHandler(eventType as 'keydown' | 'keyup' | 'keypress');
        state.globalEventListeners.set(eventType, handler);
        document.addEventListener(eventType, handler as EventListener);
      });
    }
  };

  // 动态添加键盘监听器
  const addKeyListener = (
    key: string, 
    callback: (event: KeyboardEvent) => void, 
    eventType: 'keydown' | 'keyup' | 'keypress' = 'keydown'
  ) => {
    const callbacks = getEventCallbacks(eventType);
    callbacks[key] = callback;
    
    // 如果key不在options.keys中，添加到keys列表
    if (options.keys && !options.keys.includes(key)) {
      options.keys.push(key);
    }
  };

  // 移除键盘监听器
  const removeKeyListener = (
    key: string, 
    eventType: 'keydown' | 'keyup' | 'keypress' = 'keydown'
  ) => {
    const callbacks = getEventCallbacks(eventType);
    delete callbacks[key];
  };

  // 清理所有监听器
  const destroy = () => {
    // 标记为手动销毁
    isManuallyDestroyed = true;
    
    // 清理目标元素事件监听器
    if (state.targetElement && state.isBound) {
      state.eventListeners.forEach((handler, eventType) => {
        state.targetElement!.removeEventListener(eventType, handler as EventListener);
      });
      state.eventListeners.clear();
      state.isBound = false;
      state.targetElement = null;
    }

    // 清理全局事件监听器
    if (state.globalEventListeners.size > 0) {
      state.globalEventListeners.forEach((handler, eventType) => {
        document.removeEventListener(eventType, handler as EventListener);
      });
      state.globalEventListeners.clear();
    }

    // 重置状态
    isPressed.value = false;
    pressedKeys.value = [];
  };

  // 监听目标元素变化
  watch(targetElement, (newElement) => {
    if (newElement !== state.targetElement && !isManuallyDestroyed) {
      destroy();
      if (newElement) {
        bindKeyboardEvents();
      }
    }
  });

  // 组件卸载时自动清理
  onBeforeUnmount(() => {
    destroy();
  });

  return {
    isPressed,
    pressedKeys,
    bindKeyboardEvents,
    bindGlobalEvents,
    addKeyListener,
    removeKeyListener,
    destroy,
  };
};
