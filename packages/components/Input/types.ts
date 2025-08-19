import type { VNode } from 'vue';

export type InputType = 'text' | 'textarea' | 'password' | 'email' | 'url' | 'tel' | 'number' | 'search' | 'date' | 'time' | 'datetime-local' | 'month' | 'week' | 'color' | 'file' | 'range' | 'hidden';

export interface InputProps {
  // 基础属性
  modelValue?: string;
  type?: InputType;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  clearable?: boolean;
  
  // 尺寸和样式
  size?: 'large' | 'default' | 'small';
  round?: boolean;
  prefixIcon?: string;
  suffixIcon?: string;
  
  // 输入限制
  maxlength?: number;
  minlength?: number;
  showWordLimit?: boolean;
  
  // 特殊功能
  autocomplete?: string;
  autofocus?: boolean;
  form?: string;
  name?: string;
  tabindex?: number | string;
  
  // 多行文本特有属性
  rows?: number;
  
  // 密码特有属性
  showPassword?: boolean;
}

export interface InputEmits {
  // 基础事件
  'update:modelValue': [value: string];
  'input': [value: string];
  'change': [value: string];
  'focus': [event: FocusEvent];
  'blur': [event: FocusEvent];
  
  // 特殊事件
  'clear': [];
  'enter': [event: KeyboardEvent];
  'keydown': [event: KeyboardEvent];
  'keyup': [event: KeyboardEvent];
}

export interface InputSlots {
  // 默认插槽
  default?: () => VNode[];
  
  // 前缀插槽
  prefix?: () => VNode[];
  
  // 后缀插槽
  suffix?: () => VNode[];
}
