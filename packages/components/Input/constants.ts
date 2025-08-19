// Input组件尺寸常量
export const INPUT_SIZES = ['large', 'default', 'small'] as const;

// Input组件类型常量
export const INPUT_TYPES = [
  'text',
  'textarea', 
  'password',
  'email',
  'url',
  'tel',
  'number',
  'search',
  'date',
  'time',
  'datetime-local',
  'month',
  'week',
  'color',
  'file',
  'range',
  'hidden'
] as const;

// 默认值常量
export const DEFAULT_INPUT_SIZE = 'default';
export const DEFAULT_INPUT_TYPE = 'text';
export const DEFAULT_TEXTAREA_ROWS = 2;

// CSS类名前缀
export const INPUT_CLASS_PREFIX = 'h-input';
export const INPUT_WRAPPER_CLASS_PREFIX = 'h-input-wrapper';

// 状态类名
export const INPUT_STATE_CLASSES = {
  FOCUSED: 'is-focused',
  DISABLED: 'is-disabled',
  READONLY: 'is-readonly',
  ROUND: 'is-round'
} as const;
